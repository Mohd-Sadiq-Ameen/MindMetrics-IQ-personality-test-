import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TestDashboard from "./pages/TestDashboard";
import IQTestPage from "./pages/IQTestPage";
import PersonalitySurveyPage from "./pages/PersonalitySurveyPage";
import ResultPage from "./pages/ResultPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FullAssessmentPage from "./pages/FullAssessmentPage";  // fixed import

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TestDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/iq-test"
              element={
                <ProtectedRoute>
                  <IQTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personality"
              element={
                <ProtectedRoute>
                  <PersonalitySurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personality-only"
              element={
                <ProtectedRoute>
                  <FullAssessmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:sessionId"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;