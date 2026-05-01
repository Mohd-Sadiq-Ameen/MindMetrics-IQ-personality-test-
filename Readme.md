MindMetrics
------------------------------------------------------------
MindMetrics is a web application that measures your cognitive abilities (IQ‑style test) and personality traits (Big Five / OCEAN model). It gives you a detailed report with actionable insights about your strengths, weaknesses, career fit, and relationship style.
------------------------------------------------------------
🚀 Features
------------------------------------------------------------
🧠 IQ Test – 12 multiple‑choice questions (logical, verbal, spatial, memory). Adaptive scoring with a realistic offset.

🧬 Personality Assessment – 30 questions based on the Big Five model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).

📊 Detailed Report – IQ score, percentile, trait scores, strengths/weaknesses, career suggestions, relationship style, and risk analysis.

🏆 Leaderboard – Compare your percentile with other users.

🎨 Modern UI – Clean, responsive design with gradients, progress bars, and smooth navigation.

🔐 User Accounts – Register, log in, and track your past results.
------------------------------------------------------------
🛠️ Tech Stack
------------------------------------------------------------
Backend: Flask (Python), SQLite, Flask‑JWT‑Extended, Flask‑CORS

Frontend: React, Vite, Tailwind CSS, Axios

Deployment: Local development (easily deployable to Render / Vercel)
------------------------------------------------------------
📁 Project Structure
------------------------------------------------------------
text
MindMetrics/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── auth.py
│   │   ├── test.py
│   │   ├── personality.py
│   │   ├── results.py
│   │   └── leaderboard.py
│   ├── services/
│   │   └── adaptive_logic.py
│   ├── utils/
│   │   └── db.py
│   └── instance/            (SQLite database created automatically)
└── frontend/
    ├── src/
    │   ├── pages/           (LandingPage, LoginPage, IQTestPage, FullAssessmentPage, ResultPage, LeaderboardPage...)
    │   ├── components/      (QuestionCard, Timer, ProtectedRoute...)
    │   ├── context/         (AuthContext)
    │   └── services/        (api.js)
    ├── package.json
    └── vite.config.js
🧪 How to Run Locally
------------------------------------------------------------
Prerequisites
------------------------------------------------------------
Python 3.10+ and pip

Node.js 18+ and npm
------------------------------------------------------------

1. Clone the repository
bash
git clone https://github.com/yourusername/mindmetrics.git
cd mindmetrics
2. Backend setup
------------------------------------------------------------
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
------------------------------------------------------------
Create a .env file in the backend/ folder (optional – default secrets work for development):
------------------------------------------------------------
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
------------------------------------------------------------
3. Frontend setup
Open a new terminal:
------------------------------------------------------------
cd frontend
npm install
4. Run the application
------------------------------------------------------------
Backend (first terminal):
------------------------------------------------------------
cd backend
source venv/bin/activate   # or your activation command
python app.py
------------------------------------------------------------
You should see: Running on http://127.0.0.1:5000

------------------------------------------------------------

Frontend (second terminal):

------------------------------------------------------------
cd frontend
npm run dev
------------------------------------------------------------

Visit http://localhost:5173 in your browser.

