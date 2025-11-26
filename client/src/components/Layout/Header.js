import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import '../../pages/DashboardPage.css';
import {Link} from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-logo">🎯</div>
          <h1>Starnet Gamification</h1>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <Link to="/doc" className='documentation-link' target="_blank" rel="noopener noreferrer">Documentation</Link>
            </div>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-points">{user?.points || 0} points</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
