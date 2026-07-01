import api from '../api/api';

const driverAuthService = {
  async login(data) {
    try {
      const res = await api.post('/driver-auth/login', data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    try {
      const res = await api.post('/driver-auth/logout');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Logout failed');
    }
  },

  async getProfile() {
    try {
      const res = await api.get('/driver-auth/profile');
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) return null;
      throw new Error(err.response?.data?.message || 'Failed to fetch profile');
    }
  },
};

export default driverAuthService;
