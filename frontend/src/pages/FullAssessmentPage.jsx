import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { test, personality } from '../services/api';
import axios from 'axios';

export default function FullAssessmentPage() {
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    test.start('personality')
      .then(res => {
        setSessionId(res.data.session_id);
        return axios.get('http://localhost:5000/personality/questions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
      })
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load personality test');
      });
  }, []);

  const total = questions.length;
  const current = questions[currentIndex];
  const answerSelected = answers[currentIndex] !== undefined;

  const finishTest = async (isEarly = false) => {
    setSubmitting(true);
    const answersArray = Object.entries(answers)
      .filter(([_, val]) => val !== undefined)
      .map(([idx, val]) => ({
        question_index: parseInt(idx),
        value: val
      }));
    try {
      await personality.saveAnswers(sessionId, answersArray);
      await test.submitIQ(sessionId);
      navigate(`/results/${sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Error submitting test.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!answerSelected && currentIndex === total - 1) {
      alert('Please select a rating or use Finish Early.');
      return;
    }
    if (!answerSelected) {
      // Skip unanswered automatically
      if (currentIndex + 1 < total) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishTest();
      }
      return;
    }
    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleFinishEarly = () => {
    if (window.confirm('Submit test with unanswered questions? Unanswered will be treated as neutral.')) {
      finishTest(true);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading personality test...</div>;
  if (!questions.length) return <div className="text-center mt-20">No questions available.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-sm mb-2">Personality Assessment – {currentIndex+1}/{total}</div>
          <div className="bg-gray-200 h-2 rounded">
            <div className="bg-blue-600 h-2 rounded" style={{ width: `${((currentIndex+1)/total)*100}%` }} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-6">{current.text}</h2>
          <div className="flex gap-3 my-4">
            {[1,2,3,4,5].map(v => (
              <button
                key={v}
                onClick={() => setAnswers(prev => ({ ...prev, [currentIndex]: v }))}
                className={`flex-1 py-3 rounded-xl transition
                  ${answers[currentIndex] === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">
            1 = Strongly Disagree 2 = Disagree 3 = Neutral 4 = Agree 5 = Strongly Agree
          </p>
        </div>
        <div className="flex justify-between gap-2 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-gray-500 text-white px-6 py-2 rounded-xl disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="bg-gray-500 text-white px-6 py-2 rounded-xl transition"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl transition"
          >
            {currentIndex + 1 === total ? 'Finish' : 'Next'}
          </button>
          <button
            onClick={handleFinishEarly}
            disabled={submitting}
            className="bg-red-600 text-white px-6 py-2 rounded-xl transition"
          >
            Finish Early
          </button>
        </div>
      </div>
    </div>
  );
}