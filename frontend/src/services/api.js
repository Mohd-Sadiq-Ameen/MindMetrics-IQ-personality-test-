import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const test = {
  start: (testType) => API.post('/test/start', { test_type: testType }),
  submitAnswer: (sessionId, questionId, answer, timeTaken) =>
    API.post('/test/answer', { session_id: sessionId, question_id: questionId, answer, time_taken: timeTaken }),
  submitIQ: (sessionId) => API.post('/test/submit', { session_id: sessionId }),
};

export const personality = {
  saveAnswers: (sessionId, answers) => API.post('/personality/submit', { session_id: sessionId, answers }),
};

export const results = {
  get: (sessionId) => API.get(`/results/${sessionId}`),
};

export const leaderboard = {
  get: (filter) => API.get('/leaderboard', { params: filter }),
};

export default API;