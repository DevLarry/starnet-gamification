import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, taskService } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'tasks') {
      loadTasks();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await taskService.getDailyTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId);
      await loadTasks(); // Reload tasks to get updated completion status
      return { success: true };
    } catch (error) {
      console.error('Error completing task:', error);
      return { success: false, error: 'Failed to complete task' };
    }
  };

  const dailyCheckIn = async () => {
    try {
      await authService.checkIn();
      // Refresh user data to get updated points
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      return { success: true, message: 'Daily check-in completed!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Check-in failed';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    tasks,
    tasksLoading,
    activeTab,
    setActiveTab,
    login,
    register,
    logout,
    completeTask,
    dailyCheckIn,
    refreshTasks: loadTasks,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
