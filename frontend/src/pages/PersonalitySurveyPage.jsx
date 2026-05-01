import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personality, test } from '../services/api';

export default function PersonalitySurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/personality/questions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const submitSurvey = async () => {
    const answersArray = Object.entries(answers).map(([idx, val]) => ({
      question_index: parseInt(idx),
      value: val
    }));

    const sessionRes = await test.start('full');
    const sessionId = sessionRes.data.session_id;

    await personality.saveAnswers(sessionId, answersArray);
    navigate(`/results/${sessionId}`);
  };

  if (loading) return <div className="text-center mt-20">Loading questions...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">

      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">Personality Assessment</h1>

        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl">

            <p className="mb-4 font-medium">{q.text}</p>

            <div className="flex gap-3">
              {[1,2,3,4,5].map(val => (
                <button
                  key={val}
                  onClick={() => handleAnswer(idx, val)}
                  className={`flex-1 py-2 rounded-xl transition
                    ${answers[idx] === val
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'}
                  `}
                >
                  {val}
                </button>
              ))}
            </div>

          </div>
        ))}

        <button
          onClick={submitSurvey}
          className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg"
        >
          Submit & See Results
        </button>

      </div>
    </div>
  );
}