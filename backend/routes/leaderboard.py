from flask import Blueprint, jsonify, request
from utils.db import get_db

bp = Blueprint('leaderboard', __name__, url_prefix='/leaderboard')

@bp.route('', methods=['GET'])   # ← empty string, no trailing slash
def get_leaderboard():
    filter_by = request.args.get('filter', 'global')
    age_group = request.args.get('age_group', None)
    db = get_db()
    query = '''
        SELECT anonymized_name, percentile, age_group, test_date
        FROM leaderboard_cache
    '''
    params = []
    if filter_by == 'age' and age_group:
        query += " WHERE age_group = ?"
        params.append(age_group)
    query += " ORDER BY percentile DESC LIMIT 50"
    rows = db.execute(query, params).fetchall()
    return jsonify([dict(row) for row in rows])