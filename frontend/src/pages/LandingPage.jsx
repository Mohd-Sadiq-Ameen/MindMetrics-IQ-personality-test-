import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900">

      {/* NAVBAR */}
      <nav className="backdrop-blur bg-white/70 border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold tracking-tight text-blue-700">
            🧠 MindMetrics
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          Know Your Mind.
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Unlock Your Potential.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          A scientifically inspired assessment combining cognitive intelligence testing with deep personality profiling.
          Get actionable insights — not just numbers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition"
          >
            Start Free Assessment
          </Link>

          <Link
            to="#features"
            className="px-8 py-4 rounded-xl border border-gray-300 text-lg font-semibold hover:bg-gray-100 transition"
          >
            Learn More ↓
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          🔒 Private • No hidden fees • 20–30 mins
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            What Makes Us Different
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Authentic IQ Measurement",
                desc: "Adaptive test covering logic, verbal, spatial & memory reasoning with anti-cheating validation."
              },
              {
                icon: "🧠",
                title: "Deep Personality Profile",
                desc: "Big Five (OCEAN) model used in psychology to analyze behavior, strengths & traits."
              },
              {
                icon: "📊",
                title: "Insights & Ranking",
                desc: "Understand your percentile globally and receive improvement strategies."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 text-center"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-10 text-center">
            {[
              ["Create Account", "Register with age & education for accurate results."],
              ["Take the Test", "Quick IQ or Full Assessment (IQ + Personality)."],
              ["Get Report", "Detailed insights, traits & cognitive analysis."],
              ["Improve", "Track progress and train weak areas."]
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold shadow-md">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step[0]}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA SECTION */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Beyond the Score
            </h2>

            <ul className="space-y-4 text-gray-700 leading-relaxed">
              <li>✔ Authenticity check for valid results</li>
              <li>✔ Adaptive difficulty system</li>
              <li>✔ Deep personality insights (Big Five)</li>
              <li>✔ Cognitive strength radar</li>
              <li>✔ Anonymous leaderboard</li>
            </ul>

            <Link
              to="/register"
              className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition"
            >
              Start Your Journey
            </Link>
          </div>

          <div className="rounded-3xl p-10 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="italic text-gray-800 text-lg">
              "Understanding yourself is the first step toward improvement."
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Inspired by scientific assessment frameworks
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-medium">
            © 2025 MindMetrics – Cognitive & Personality Assessment
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Educational use only. Not a clinical diagnostic tool.
          </p>
        </div>
      </footer>

    </div>
  );
}