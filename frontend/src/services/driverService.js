import api from '../api/api';

const driverService = {
  async getAll() {
    const res = await api.get('/drivers');
    return res.data;
  },

  async getOne(id) {
    const res = await api.get(`/drivers/${id}`);
    return res.data;
  },

  async create(formData) {
    const res = await api.post('/drivers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async update(id, formData) {
    const res = await api.put(`/drivers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async suspend(id) {
    const res = await api.patch(`/drivers/${id}/suspend`);
    return res.data;
  },

  async activate(id) {
    const res = await api.patch(`/drivers/${id}/activate`);
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/drivers/${id}`);
    return res.data;
  },
};

export default driverService;
