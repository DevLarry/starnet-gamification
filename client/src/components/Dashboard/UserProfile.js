import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';
import ConnectWalletButton from '../Common/ConnectWalletButton';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    // Implement profile update logic here
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-badge">Level {user.level || 1}</div>
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="form-input"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="info-item">
                  <label>Name</label>
                  <span>{user.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Bio</label>
                  <span>{user.bio || 'No bio yet'}</span>
                </div>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit Profile
                </button>
                <ConnectWalletButton />
              </>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="stats-card">
          <h3>Your Stats</h3>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">{user.points || 0}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.completedTasks || 0}</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.streak || 0}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.level || 1}</div>
              <div className="stat-label">Current Level</div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="actions-card">
          <h3>Account Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">Change Password</button>
            <button className="action-btn secondary">
              Notification Settings
            </button>
            <button onClick={logout} className="action-btn danger">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
