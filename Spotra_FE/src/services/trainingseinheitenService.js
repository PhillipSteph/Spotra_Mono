import { apiClient } from './apiClient';

export const trainingseinheitenService = {
  getAll: () => apiClient.get('/einheiten'),
  getById: (id) => apiClient.get(`/einheiten/${id}`),
  create: (geraetId) => apiClient.post('/einheiten', { geraet: { id: geraetId } }),
  delete: (id) => apiClient.delete(`/einheiten/${id}`),
};
