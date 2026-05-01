import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { results } from '../services/api';

export default function ResultPage() {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    results.get(sessionId)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="text-center mt-20">Loading results...</div>;
  if (!data) return <div className="text-center mt-20">No results found.</div>;

  // Helper to get level description
  const getLevelDesc = (score) => {
    if (score >= 70) return "High (strong tendency)";
    if (score >= 60) return "Moderately high";
    if (score <= 30) return "Low (weak tendency)";
    if (score <= 40) return "Moderately low";
    return "Average (balanced)";
  };

  // Full trait names
  const traitNames = {
    O: "Openness (curiosity, creativity)",
    C: "Conscientiousness (organisation, discipline)",
    E: "Extraversion (sociability, energy)",
    A: "Agreeableness (cooperation, empathy)",
    N: "Neuroticism (emotional sensitivity)"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Your Results</h1>

        {/* IQ Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">🧠 Cognitive Assessment</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium">IQ Score:</span> {data.iq_score}</div>
            <div><span className="font-medium">Percentile:</span> {data.percentile}%</div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {data.iq_score >= 115 ? "Above average – good problem‑solving ability." :
             data.iq_score >= 85 ? "Average – solid cognitive skills." :
             "Below average – consider brain‑training exercises."}
          </p>
        </div>

        {/* Personality Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">🧬 Personality Profile (Big Five)</h2>
          
          {data.big5 && Object.keys(data.big5).length > 0 ? (
            <>
              {/* Score table */}
              <div className="space-y-3 mb-6">
                {Object.entries(data.big5).map(([trait, score]) => (
                  <div key={trait}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{traitNames[trait] || trait}</span>
                      <span>{score} – {getLevelDesc(score)}</span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full mt-1">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights (if backend sent them) */}
              {data.insights && (
                <>
                  {data.insights.strengths && data.insights.strengths.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-green-700">✅ Strengths</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {data.insights.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {data.insights.weaknesses && data.insights.weaknesses.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-red-700">⚠️ Areas to watch</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {data.insights.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                  {data.insights.career_fits && data.insights.career_fits.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-blue-700">💼 Career suggestions</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {data.insights.career_fits.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {data.insights.relationship_style && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-purple-700">❤️ Relationship style</h3>
                      <p className="text-gray-700">{data.insights.relationship_style}</p>
                    </div>
                  )}
                  {data.insights.risk_analysis && data.insights.risk_analysis.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-orange-700">🔍 Self‑awareness tips</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {data.insights.risk_analysis.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-gray-500">Complete the personality test to see your profile.</p>
          )}
        </div>

        {/* Advice */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">📈 Final Advice</h2>
          <p className="text-gray-700">{data.advice || "Keep challenging your mind – try puzzles, reading, or learning a new skill."}</p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}