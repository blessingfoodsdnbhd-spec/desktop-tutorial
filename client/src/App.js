import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GeneratePage from './pages/GeneratePage';
import HistoryPage from './pages/HistoryPage';
import ResultPage from './pages/ResultPage';
import LandingPage from './pages/LandingPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/generate" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/generate" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/generate" /> : <RegisterPage />} />
        <Route path="/generate" element={<PrivateRoute><GeneratePage /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="/result/:id" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
      </Routes>
    </>
  );
}
