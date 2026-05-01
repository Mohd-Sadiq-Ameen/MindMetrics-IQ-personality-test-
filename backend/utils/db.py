import sqlite3
from flask import g
from config import Config

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        # Ensure the instance directory exists before connecting
        import os
        os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
        db = g._database = sqlite3.connect(Config.DATABASE_PATH)
        db.row_factory = sqlite3.Row
    return db

def close_db(e=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()