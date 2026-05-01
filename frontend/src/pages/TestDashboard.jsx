import { Link } from 'react-router-dom';

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Choose Your Assessment
        </h1>
        <p className="text-gray-600 mb-10">
          Select the test that fits your goal
        </p>

        <div className="grid gap-6">
          {/* IQ TEST */}
          <Link
            to="/iq-test"
            className="group p-6 rounded-2xl bg-white border border-gray-300 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              Quick IQ Test
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              15 minutes • Cognitive only
            </p>
          </Link>

          {/* PERSONALITY ASSESSMENT (styled like IQ card) */}
          <Link
            to="/personality-only"
            className="group p-6 rounded-2xl bg-white border border-gray-300 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              Personality Assessment (Big Five)
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              30 questions • Big Five traits
            </p>
          </Link>

          {/* LEADERBOARD */}
          <Link
            to="/leaderboard"
            className="group p-6 rounded-2xl bg-white border border-gray-300 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition">
              Leaderboard
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Compare your performance
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}