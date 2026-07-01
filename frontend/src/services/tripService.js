import api from '../api/api';

const tripService = {
  // ── Public (guest booking) ──────────────────────────────
  async create(payload) {
    const res = await api.post('/trips', payload);
    return res.data;
  },

  async getOne(id) {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },

  async cancel(id, reason) {
    const res = await api.patch(`/trips/${id}/cancel`, { reason });
    return res.data;
  },

  // ── Admin ────────────────────────────────────────────────
  async adminCancel(id, reason) {
    const res = await api.patch(`/trips/${id}/admin-cancel`, { reason });
    return res.data;
  },
  async getAll() {
    const res = await api.get('/trips');
    return res.data;
  },

  async assign(id, driverId) {
    const res = await api.patch(`/trips/${id}/assign`, { driverId });
    return res.data;
  },

  async arrivedAtPickup(id, coords) {
    const res = await api.patch(`/trips/${id}/arrived-pickup`, coords);
    return res.data;
  },

  async start(id) {
    const res = await api.patch(`/trips/${id}/start`);
    return res.data;
  },

  async complete(id) {
    const res = await api.patch(`/trips/${id}/complete`);
    return res.data;
  },

  async grantComplete(id) {
    const res = await api.patch(`/trips/${id}/grant-complete`);
    return res.data;
  },

  async markPaid(id) {
    const res = await api.patch(`/trips/${id}/mark-paid`);
    return res.data;
  },

  async markUnpaid(id) {
    const res = await api.patch(`/trips/${id}/mark-unpaid`);
    return res.data;
  },
};

export default tripService;
