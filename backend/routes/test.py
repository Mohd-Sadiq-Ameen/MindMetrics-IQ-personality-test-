from flask import Blueprint, request, jsonify
from utils.db import get_db
import datetime

bp = Blueprint('test', __name__, url_prefix='/test')

# 12 hardcoded questions
QUESTIONS = [
    {"id": 1, "text": "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.", "options": '["True","False"]', "answer": "True", "subtype": "logical"},
    {"id": 2, "text": "Choose the word most similar to 'Ephemeral'.", "options": '["Eternal","Brief","Solid","Slow"]', "answer": "Brief", "subtype": "verbal"},
    {"id": 3, "text": "What number comes next? 2, 6, 12, 20, ?", "options": '["28","30","32","36"]', "answer": "30", "subtype": "memory"},
    {"id": 4, "text": "If you rearrange the letters 'CIFAIPC' you get the name of a:", "options": '["City","Animal","Fruit","Country"]', "answer": "Fruit", "subtype": "verbal"},
    {"id": 5, "text": "A train travels 60 miles in 2 hours. Average speed?", "options": '["20 mph","30 mph","40 mph","60 mph"]', "answer": "30 mph", "subtype": "logical"},
    {"id": 6, "text": "Which is different? Apple, Banana, Carrot, Orange", "options": '["Apple","Banana","Carrot","Orange"]', "answer": "Carrot", "subtype": "verbal"},
    {"id": 7, "text": "Complete the pattern: 1, 4, 9, 16, ?", "options": '["20","25","30","36"]', "answer": "25", "subtype": "memory"},
    {"id": 8, "text": "If a circle has radius 3, what is its area? (π=3.14)", "options": '["18.84","28.26","9.42","12.56"]', "answer": "28.26", "subtype": "spatial"},
    {"id": 9, "text": "Which shape completes the pattern? (Assume A,B,C,D)", "options": '["A","B","C","D"]', "answer": "C", "subtype": "spatial"},
    {"id": 10, "text": "If 2 cats catch 2 mice in 2 minutes, how many cats catch 100 mice in 100 minutes?", "options": '["2","50","100","200"]', "answer": "2", "subtype": "logical"},
    {"id": 11, "text": "'Piscine' refers to which animal?", "options": '["Fish","Bird","Snake","Cat"]', "answer": "Fish", "subtype": "verbal"},
    {"id": 12, "text": "What is the next number? 3, 8, 15, 24, ?", "options": '["35","36","37","38"]', "answer": "35", "subtype": "memory"},
]

@bp.route('/start', methods=['POST'])
def start_test():
    try:
        data = request.get_json(silent=True)
        test_type = data.get('test_type', 'iq') if data else 'iq'
        user_id = 1  # hardcoded; replace with JWT when ready
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO test_sessions (user_id, test_type, started_at) VALUES (?, ?, ?)',
            (user_id, test_type, datetime.datetime.now())
        )
        db.commit()
        session_id = cursor.lastrowid
        q = QUESTIONS[0]
        return jsonify({
            'session_id': session_id,
            'question': {
                'id': q['id'],
                'text': q['text'],
                'options': q['options'],
                'subtype': q['subtype']
            }
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bp.route('/answer', methods=['POST'])
def submit_answer():
    data = request.get_json()
    session_id = data['session_id']
    question_id = data['question_id']
    user_choice = data.get('answer', '')

    q = next((q for q in QUESTIONS if q['id'] == question_id), None)
    if not q:
        return jsonify({'error': 'Question not found'}), 404
    is_correct = (user_choice == q['answer']) if user_choice else False

    db = get_db()
    db.execute(
        'INSERT INTO iq_answers (session_id, question_id, user_choice, is_correct) VALUES (?, ?, ?, ?)',
        (session_id, question_id, user_choice, is_correct)
    )
    db.commit()

    current_index = next(i for i, qq in enumerate(QUESTIONS) if qq['id'] == question_id)
    next_index = current_index + 1
    if next_index >= len(QUESTIONS):
        return jsonify({'is_last': True})

    next_q = QUESTIONS[next_index]
    return jsonify({
        'is_last': False,
        'next_question': {
            'id': next_q['id'],
            'text': next_q['text'],
            'options': next_q['options'],
            'subtype': next_q['subtype']
        }
    })

@bp.route('/submit', methods=['POST'])
@bp.route('/submit', methods=['POST'])
def finish_test():
    data = request.get_json()
    session_id = data['session_id']
    db = get_db()

    correct = db.execute('SELECT COUNT(*) FROM iq_answers WHERE session_id = ? AND is_correct = 1', (session_id,)).fetchone()[0]
    total = db.execute('SELECT COUNT(*) FROM iq_answers WHERE session_id = ?', (session_id,)).fetchone()[0]
    score = int((correct / total) * 100) if total else 100

    # Base IQ from raw score
    iq = 100 + (score - 50) * 0.3

    # Apply calibration offset (-6.5 points)
    iq = iq - 6.5

    # Clamp to realistic range
    iq = max(70, min(145, round(iq)))

    percentile = max(1, min(99, round((iq - 100) * 0.5 + 50, 2)))

    existing = db.execute('SELECT 1 FROM results WHERE session_id = ?', (session_id,)).fetchone()
    if existing:
        db.execute('UPDATE results SET iq_raw = ?, iq_percentile = ? WHERE session_id = ?', (iq, percentile, session_id))
    else:
        db.execute('INSERT INTO results (session_id, iq_raw, iq_percentile) VALUES (?, ?, ?)', (session_id, iq, percentile))

    db.execute('UPDATE test_sessions SET completed_at = ? WHERE id = ?', (datetime.datetime.now(), session_id))
    db.commit()

    # Leaderboard update (unchanged)
    try:
        db.execute('''
            INSERT OR REPLACE INTO leaderboard_cache (user_id, anonymized_name, percentile, age_group, test_date)
            SELECT u.id, substr(u.email, 1, 3) || '***', r.iq_percentile, u.age_group, ts.completed_at
            FROM results r
            JOIN test_sessions ts ON r.session_id = ts.id
            JOIN users u ON ts.user_id = u.id
            WHERE r.session_id = ?
        ''', (session_id,))
        db.commit()
    except:
        pass

    return jsonify({'iq_score': iq, 'percentile': percentile})