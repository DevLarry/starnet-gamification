import api from './api';

// Auth service functions
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  confirmEmail: async (email, code) => {
    const response = await api.get('/auth/confirm-email', {
      params: { email, code },
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.get('/auth/forgot-password', {
      params: { email },
    });
    return response.data;
  },

  resetPassword: async (email, password, otp) => {
    const response = await api.post(
      '/auth/reset-password',
      {
        email,
        password,
        otp,
      },
      {
        params: { email },
      },
    );
    return response.data;
  },

  checkIn: async () => {
    const response = await api.get('/auth/check-in');
    return response.data;
  },
};

// Task service functions
export const taskService = {
  getTasks: async () => {
    const response = await api.get('/task');
    return response.data;
  },

  getDailyTasks: async () => {
    const response = await api.get('/task/daily');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/task', taskData);
    return response.data;
  },

  completeTask: async (taskId) => {
    const response = await api.post(`/task/${taskId}/complete`);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.patch(`/task/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/task/${taskId}`);
    return response.data;
  },
};

export const walletService = {
  connectWallet: async (walletAddress) => {
    const response = await api.post('/wallet', { address: walletAddress });
    return response.data;
  },
}

// Default export for backward compatibility
export default {
  authService,
  taskService,
};
