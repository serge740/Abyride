import api from '../api/api';

const adminAuthService = {
  async login(data) {
    try {
      const res = await api.post('/admin-auth/login', data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    try {
      const res = await api.post('/admin-auth/logout');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Logout failed');
    }
  },

  async getProfile() {
    try {
      const res = await api.get('/admin-auth/profile');
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) return null;
      throw new Error(err.response?.data?.message || 'Failed to fetch profile');
    }
  },

  async changePassword(data) {
    try {
      const res = await api.patch('/admin-auth/change-password', data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to change password');
    }
  },
};

export default adminAuthService;
