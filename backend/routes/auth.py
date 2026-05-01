from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db   # <-- correct import
import sqlite3

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    age_group = data.get('age_group')
    education = data.get('education')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        hashed = generate_password_hash(password)
        cursor.execute(
            'INSERT INTO users (email, password_hash, age_group, education) VALUES (?, ?, ?, ?)',
            (email, hashed, age_group, education)
        )
        db.commit()
        return jsonify({'message': 'User created'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    db = get_db()
    user = db.execute('SELECT id, password_hash FROM users WHERE email = ?', (email,)).fetchone()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    if not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user['id'])
    return jsonify({'access_token': token, 'user_id': user['id']})