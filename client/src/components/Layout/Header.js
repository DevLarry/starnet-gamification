import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-logo">🎯</div>
            <h1>Starnet Dashboard</h1>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name || 'User'}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <button onClick={logout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;
