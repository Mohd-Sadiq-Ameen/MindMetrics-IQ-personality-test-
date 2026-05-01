import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { test } from '../services/api';

const TOTAL_IQ = 12;

export default function IQTestPage() {
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    test.start('iq')
      .then(res => {
        setSessionId(res.data.session_id);
        setQuestions([res.data.question]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to start IQ test');
      });
  }, []);

  const saveAnswerAndFetchNext = async (selectedAnswer) => {
    const currentQ = questions[currentIndex];
    try {
      const res = await test.submitAnswer(sessionId, currentQ.id, selectedAnswer, 0);
      if (res.data.is_last) {
        await test.submitIQ(sessionId);
        navigate(`/results/${sessionId}`);
        return true;
      } else {
        setQuestions(prev => [...prev, res.data.next_question]);
        setCurrentIndex(prev => prev + 1);
        return true;
      }
    } catch (err) {
      console.error(err);
      alert('Error saving answer');
      return false;
    }
  };

  const handleNext = async () => {
    const currentQ = questions[currentIndex];
    const selected = answers[currentQ.id];
    if (!selected) {
      alert('Please select an answer or use Skip.');
      return;
    }
    setLoading(true);
    await saveAnswerAndFetchNext(selected);
    setLoading(false);
  };

  const handleSkip = async () => {
    const currentQ = questions[currentIndex];
    setLoading(true);
    // skip: send empty answer (backend marks it as incorrect)
    const res = await test.submitAnswer(sessionId, currentQ.id, '', 0);
    if (res.data.is_last) {
      await test.submitIQ(sessionId);
      navigate(`/results/${sessionId}`);
    } else {
      setQuestions(prev => [...prev, res.data.next_question]);
      setCurrentIndex(prev => prev + 1);
    }
    setLoading(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmitEarly = async () => {
    if (submitting) return;
    setSubmitting(true);
    const currentQ = questions[currentIndex];
    if (answers[currentQ.id]) {
      await test.submitAnswer(sessionId, currentQ.id, answers[currentQ.id], 0);
    }
    await test.submitIQ(sessionId);
    navigate(`/results/${sessionId}`);
  };

  if (loading) return <div className="text-center mt-20">Loading IQ test...</div>;
  if (!questions.length) return <div className="text-center mt-20">No questions available.</div>;

  const currentQ = questions[currentIndex];
  const options = JSON.parse(currentQ.options);
  const progress = ((currentIndex + 1) / TOTAL_IQ) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-sm mb-2">IQ Test – {currentIndex+1}/{TOTAL_IQ}</div>
          <div className="bg-gray-200 h-2 rounded">
            <div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>
          {options.map((opt, idx) => (
            <label key={idx} className={`block p-4 border rounded-xl mb-3 cursor-pointer ${answers[currentQ.id] === opt ? 'bg-blue-50 border-blue-600' : ''}`}>
              <input
                type="radio"
                name="iq"
                value={opt}
                checked={answers[currentQ.id] === opt}
                onChange={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
              />
              {String.fromCharCode(65+idx)}. {opt}
            </label>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-gray-500 text-white py-2 rounded-xl disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="bg-gray-500 text-white py-2 rounded-xl transition"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="bg-blue-600 text-white py-2 rounded-xl transition"
          >
            Next
          </button>
          <button
            onClick={handleSubmitEarly}
            disabled={submitting}
            className="bg-green-600 text-white py-2 rounded-xl transition"
          >
            {submitting ? 'Submitting...' : 'Finish Early'}
          </button>
        </div>
      </div>
    </div>
  );
}