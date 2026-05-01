import sqlite3
from config import Config

DATABASE = Config.DATABASE_PATH

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                age_group TEXT,
                education TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Test sessions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                test_type TEXT,
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                authenticity_score REAL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        # IQ answers
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS iq_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER,
                question_id INTEGER,
                user_choice TEXT,
                is_correct BOOLEAN,
                time_taken REAL,
                FOREIGN KEY(session_id) REFERENCES test_sessions(id)
            )
        ''')
        # Personality answers
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS personality_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER,
                trait TEXT,
                question_index INTEGER,
                value INTEGER,
                FOREIGN KEY(session_id) REFERENCES test_sessions(id)
            )
        ''')
        # Questions bank (sample columns)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                options TEXT,
                correct_answer TEXT,
                difficulty INTEGER,
                subtype TEXT,
                age_min INTEGER,
                age_max INTEGER
            )
        ''')
        # Results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS results (
                session_id INTEGER PRIMARY KEY,
                iq_raw REAL,
                iq_percentile REAL,
                big5_json TEXT,
                strengths TEXT,
                weaknesses TEXT,
                FOREIGN KEY(session_id) REFERENCES test_sessions(id)
            )
        ''')
        # Leaderboard cache
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leaderboard_cache (
                user_id INTEGER,
                anonymized_name TEXT,
                percentile REAL,
                age_group TEXT,
                test_date TIMESTAMP
            )
        ''')
        conn.commit()