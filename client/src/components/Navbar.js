import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, History, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/generate" className="navbar-brand">
          <Sparkles size={24} />
          <span>FoodAI</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/generate"
            className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
          >
            <Sparkles size={18} />
            Generate
          </Link>
          <Link
            to="/history"
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            <History size={18} />
            History
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button onClick={logout} className="btn-logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
