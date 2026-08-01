import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import LearningModule from './pages/LearningModule';
import QuizConfig from './pages/QuizConfig';
import QuizSession from './pages/QuizSession';
import QuizResult from './pages/QuizResult';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AiChatbot from './components/AiChatbot';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuthStore();
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/learn" element={
            <ProtectedRoute>
              <LearningModule />
            </ProtectedRoute>
          } />

          <Route path="/quiz" element={
            <ProtectedRoute>
              <QuizConfig />
            </ProtectedRoute>
          } />
          
          <Route path="/quiz/session" element={
            <ProtectedRoute>
              <QuizSession />
            </ProtectedRoute>
          } />

          <Route path="/quiz/result" element={
            <ProtectedRoute>
              <QuizResult />
            </ProtectedRoute>
          } />

          <Route path="/teacher" element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Floating AI Chatbot */}
        <AiChatbot />
      </div>
    </Router>
  );
}

export default App;
