from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import init_db
from utils.db import close_db
import routes.auth as auth
import routes.test as test
import routes.personality as personality
import routes.results as results
import routes.leaderboard as leaderboard

app = Flask(__name__)
app.config.from_object(Config)

# Allow CORS for frontend (React on port 5173)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)
jwt = JWTManager(app)

app.register_blueprint(auth.bp)
app.register_blueprint(test.bp)

app.register_blueprint(personality.bp)
app.register_blueprint(results.bp)
app.register_blueprint(leaderboard.bp)

@app.teardown_appcontext
def close_connection(exception=None):
    close_db(exception)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, port=5000)