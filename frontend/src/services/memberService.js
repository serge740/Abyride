import api from '../api/api';

const memberService = {
  async getAll() {
    const res = await api.get('/members');
    return res.data;
  },

  async getOne(id) {
    const res = await api.get(`/members/${id}`);
    return res.data;
  },

  async suspend(id) {
    const res = await api.patch(`/members/${id}/suspend`);
    return res.data;
  },

  async activate(id) {
    const res = await api.patch(`/members/${id}/activate`);
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/members/${id}`);
    return res.data;
  },
};

export default memberService;
