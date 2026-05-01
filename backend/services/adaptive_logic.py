import random

def select_next_question(current_difficulty, previous_subtypes, db_session, age_group):
    """
    Select a question from the bank with difficulty close to current_difficulty.
    Avoid same subtype as last two.
    """
    cursor = db_session.cursor()
    # age_group e.g., '12-17' -> age_min=12, age_max=17
    if age_group == '12-17':
        age_min, age_max = 12, 17
    else:
        age_min, age_max = 18, 60

    query = '''
        SELECT id, text, options, correct_answer, difficulty, subtype
        FROM questions
        WHERE age_min <= ? AND age_max >= ?
        AND difficulty BETWEEN ? AND ?
    '''
    # Allow difficulty range current_difficulty ±2
    low = max(1, current_difficulty - 2)
    high = min(10, current_difficulty + 2)
    cursor.execute(query, (age_max, age_min, low, high))
    candidates = cursor.fetchall()
    # Filter out last two subtypes if possible
    if len(previous_subtypes) >= 2:
        candidates = [c for c in candidates if c['subtype'] not in previous_subtypes[-2:]]
    if not candidates:
        candidates = cursor.fetchall()  # fallback
    return random.choice(candidates) if candidates else None

def compute_iq_score(session_id, db_session):
    cursor = db_session.cursor()
    cursor.execute('''
        SELECT q.difficulty, ia.is_correct
        FROM iq_answers ia
        JOIN questions q ON ia.question_id = q.id
        WHERE ia.session_id = ?
    ''', (session_id,))
    answers = cursor.fetchall()
    if not answers:
        return 100  # default
    total_weight = sum(q['difficulty'] for q in answers if q['is_correct'])
    max_weight = sum(q['difficulty'] for q in answers)
    if max_weight == 0:
        return 100
    raw_score = (total_weight / max_weight) * 100
    # Convert to IQ scale (mean 100, SD 15)
    iq = 100 + (raw_score - 50) * 0.3  # rough scaling
    return round(iq)