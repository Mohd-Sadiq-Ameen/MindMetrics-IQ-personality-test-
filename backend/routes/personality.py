from flask import Blueprint, request, jsonify
from utils.db import get_db
import json

bp = Blueprint('personality', __name__, url_prefix='/personality')

# 30 questions: 6 per trait (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
QUESTIONS = [
    # Openness (O)
    {"text": "I enjoy exploring new ideas.", "trait": "O", "reverse": False},
    {"text": "I have a vivid imagination.", "trait": "O", "reverse": False},
    {"text": "I like art, music, or abstract thinking.", "trait": "O", "reverse": False},
    {"text": "I prefer routine over novelty.", "trait": "O", "reverse": True},
    {"text": "I am not interested in abstract ideas.", "trait": "O", "reverse": True},
    {"text": "I enjoy philosophical discussions.", "trait": "O", "reverse": False},
    # Conscientiousness (C)
    {"text": "I complete tasks thoroughly.", "trait": "C", "reverse": False},
    {"text": "I follow schedules and plans.", "trait": "C", "reverse": False},
    {"text": "I pay attention to details.", "trait": "C", "reverse": False},
    {"text": "I often forget to put things back in place.", "trait": "C", "reverse": True},
    {"text": "I tend to be disorganized.", "trait": "C", "reverse": True},
    {"text": "I like order and checklists.", "trait": "C", "reverse": False},
    # Extraversion (E)
    {"text": "I am the life of the party.", "trait": "E", "reverse": False},
    {"text": "I feel comfortable around people.", "trait": "E", "reverse": False},
    {"text": "I enjoy being the center of attention.", "trait": "E", "reverse": False},
    {"text": "I prefer to be alone.", "trait": "E", "reverse": True},
    {"text": "I get tired after social events.", "trait": "E", "reverse": True},
    {"text": "I like to start conversations.", "trait": "E", "reverse": False},
    # Agreeableness (A)
    {"text": "I sympathize with others' feelings.", "trait": "A", "reverse": False},
    {"text": "I am interested in people.", "trait": "A", "reverse": False},
    {"text": "I avoid conflict.", "trait": "A", "reverse": False},
    {"text": "I tend to criticize others.", "trait": "A", "reverse": True},
    {"text": "I am not interested in other people's problems.", "trait": "A", "reverse": True},
    {"text": "I believe people have good intentions.", "trait": "A", "reverse": False},
    # Neuroticism (N)
    {"text": "I get stressed easily.", "trait": "N", "reverse": False},
    {"text": "I worry about things.", "trait": "N", "reverse": False},
    {"text": "I feel emotionally unstable.", "trait": "N", "reverse": False},
    {"text": "I am relaxed most of the time.", "trait": "N", "reverse": True},
    {"text": "I rarely feel anxious.", "trait": "N", "reverse": True},
    {"text": "I get upset easily.", "trait": "N", "reverse": False},
]

@bp.route('/questions', methods=['GET'])
def get_questions():
    return jsonify({"questions": QUESTIONS})

@bp.route('/submit', methods=['POST'])
def submit_personality():
    data = request.get_json()
    session_id = data.get('session_id')
    answers = data.get('answers', [])

    db = get_db()
    db.execute('DELETE FROM personality_answers WHERE session_id = ?', (session_id,))
    
    for ans in answers:
        idx = ans['question_index']
        value = ans['value']
        q = QUESTIONS[idx]
        if q['reverse']:
            value = 6 - value
        db.execute(
            'INSERT INTO personality_answers (session_id, trait, question_index, value) VALUES (?, ?, ?, ?)',
            (session_id, q['trait'], idx, value)
        )
    db.commit()

    # Compute trait scores
    trait_sums = {'O':0, 'C':0, 'E':0, 'A':0, 'N':0}
    trait_counts = {'O':0, 'C':0, 'E':0, 'A':0, 'N':0}
    rows = db.execute('SELECT trait, value FROM personality_answers WHERE session_id = ?', (session_id,)).fetchall()
    for row in rows:
        t = row['trait']
        trait_sums[t] += row['value']
        trait_counts[t] += 1

    scores = {}
    for t in trait_sums:
        if trait_counts[t] == 0:
            scores[t] = 50.0
        else:
            min_raw = trait_counts[t] * 1
            max_raw = trait_counts[t] * 5
            percent = (trait_sums[t] - min_raw) / (max_raw - min_raw) * 100
            scores[t] = round(percent, 1)

    # Ensure results row exists (create if not) then update big5_json
    exists = db.execute('SELECT 1 FROM results WHERE session_id = ?', (session_id,)).fetchone()
    if not exists:
        db.execute('INSERT INTO results (session_id, iq_raw, iq_percentile) VALUES (?, ?, ?)', (session_id, 0, 0))
        db.commit()
    
    db.execute('UPDATE results SET big5_json = ? WHERE session_id = ?', (json.dumps(scores), session_id))
    db.commit()

    return jsonify({"big5_scores": scores})