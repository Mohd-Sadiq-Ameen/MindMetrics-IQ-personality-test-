from flask import Blueprint, jsonify
from utils.db import get_db
import json

bp = Blueprint('results', __name__, url_prefix='/results')

def big5_insights(scores):
    """Return detailed insights based on Big5 scores (0-100)."""
    # Map trait names
    traits = {
        'O': 'Openness',
        'C': 'Conscientiousness',
        'E': 'Extraversion',
        'A': 'Agreeableness',
        'N': 'Neuroticism'
    }
    desc = {}
    for t, name in traits.items():
        score = scores.get(t, 50)
        if score >= 70:
            level = "High"
        elif score <= 30:
            level = "Low"
        else:
            level = "Medium"
        desc[t] = {"name": name, "score": score, "level": level}

    # Career suggestions
    career = []
    if desc['O']['level'] in ['High', 'Medium']:
        career.append("Creative fields (design, writing, research)")
    if desc['C']['level'] == 'High':
        career.append("Management, engineering, project coordination")
    if desc['E']['level'] == 'High':
        career.append("Sales, leadership, public relations")
    if desc['A']['level'] == 'High':
        career.append("Healthcare, teaching, social work")
    if desc['N']['level'] == 'Low':
        career.append("High‑pressure jobs (emergency, military)")

    # Strengths & Weaknesses
    strengths = []
    if desc['O']['score'] > 60: strengths.append("Creative and curious")
    if desc['C']['score'] > 60: strengths.append("Organised and reliable")
    if desc['E']['score'] > 60: strengths.append("Energetic and social")
    if desc['A']['score'] > 60: strengths.append("Empathetic and cooperative")
    if desc['N']['score'] < 40: strengths.append("Emotionally stable")

    weaknesses = []
    if desc['O']['score'] < 40: weaknesses.append("Resistant to new ideas")
    if desc['C']['score'] < 40: weaknesses.append("May struggle with deadlines")
    if desc['E']['score'] < 40: weaknesses.append("Prefers solitude – can be seen as distant")
    if desc['A']['score'] < 40: weaknesses.append("May be perceived as blunt or competitive")
    if desc['N']['score'] > 60: weaknesses.append("Prone to stress and anxiety")

    # Relationship style
    if desc['A']['score'] > 60 and desc['N']['score'] < 40:
        relationship = "Supportive and calm partner; good at resolving conflicts."
    elif desc['A']['score'] < 40:
        relationship = "Direct and honest; may need conscious effort to compromise."
    elif desc['N']['score'] > 60:
        relationship = "Emotionally sensitive; appreciates reassurance and routine."
    else:
        relationship = "Balanced – adapts to partner's needs."

    # Risk analysis
    risk = []
    if desc['N']['score'] > 60 and desc['C']['score'] < 40:
        risk.append("Higher risk of anxiety and poor discipline – consider stress management.")
    if desc['E']['score'] > 70 and desc['A']['score'] < 30:
        risk.append("May dominate conversations; work on active listening.")
    if not risk:
        risk.append("No major red flags; continue self‑awareness practices.")

    return {
        "traits": desc,
        "career_fits": career[:3],
        "strengths": strengths[:3],
        "weaknesses": weaknesses[:3],
        "relationship_style": relationship,
        "risk_analysis": risk
    }

@bp.route('/<int:session_id>', methods=['GET'])
def get_results(session_id):
    db = get_db()
    # IQ results
    iq_row = db.execute('SELECT iq_raw, iq_percentile FROM results WHERE session_id = ?', (session_id,)).fetchone()
    if not iq_row:
        return jsonify({'error': 'No results found'}), 404

    # Personality scores
    big5_json = db.execute('SELECT big5_json FROM results WHERE session_id = ?', (session_id,)).fetchone()
    big5_scores = json.loads(big5_json[0]) if big5_json and big5_json[0] else {}

    # Detailed insights
    insights = big5_insights(big5_scores) if big5_scores else {}

    # IQ interpretation
    iq_score = iq_row['iq_raw']
    if iq_score > 130:
        iq_label = "Superior"
    elif iq_score > 115:
        iq_label = "Above average"
    elif iq_score > 85:
        iq_label = "Average"
    elif iq_score > 70:
        iq_label = "Below average"
    else:
        iq_label = "Low"

    return jsonify({
        'iq_score': iq_score,
        'iq_label': iq_label,
        'percentile': iq_row['iq_percentile'],
        'big5': big5_scores,
        'insights': insights,
        'advice': "Your brain is like a muscle – keep learning new things and practicing puzzles to improve cognitive flexibility."
    })