import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import TaskList from '../components/Dashboard/TaskList';
import UserProfile from '../components/Dashboard/UserProfile';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, activeTab, setActiveTab } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'tasks':
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-logo">🎯</div>
            <h1>Starnet Gamification</h1>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name || 'User'}</span>
                <span className="user-points">{user.points || 0} points</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-layout">
        {/* Sidebar Navigation */}
        <nav className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <button
              className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <span className="nav-icon">📋</span>
              Tasks
            </button>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              Profile
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Points</span>
              <span className="stat-value">{user.points || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tasks Completed</span>
              <span className="stat-value">{user.completedTasks || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">{user.streak || 0} days</span>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="dashboard-main">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardPage;
