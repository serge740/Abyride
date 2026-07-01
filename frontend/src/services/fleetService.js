import api from '../api/api';

const fleetService = {
  async getAll() {
    const res = await api.get('/fleets');
    return res.data;
  },

  async getAllForAdmin() {
    const res = await api.get('/fleets/admin/all');
    return res.data;
  },

  async getOne(id) {
    const res = await api.get(`/fleets/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/fleets', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/fleets/${id}`, data);
    return res.data;
  },

  async activate(id) {
    const res = await api.patch(`/fleets/${id}/activate`);
    return res.data;
  },

  async deactivate(id) {
    const res = await api.patch(`/fleets/${id}/deactivate`);
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/fleets/${id}`);
    return res.data;
  },
};

export default fleetService;
