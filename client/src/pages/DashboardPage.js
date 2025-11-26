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

  if (user)
    return (
      <div className="dashboard-container">

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
                <span className="stat-value">{user.point || 0}</span>
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
