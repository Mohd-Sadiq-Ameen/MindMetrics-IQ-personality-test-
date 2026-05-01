import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask secret (used by JWT if JWT_SECRET_KEY is not set)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-this-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret-key-change-this')
    
    # Database path
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, 'instance', 'app.db')
    
    # Ensure instance directory exists
    instance_dir = os.path.join(BASE_DIR, 'instance')
    os.makedirs(instance_dir, exist_ok=True)