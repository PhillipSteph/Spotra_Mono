import { apiClient } from './apiClient';

export const sportgeraeteService = {
  getAll: () => apiClient.get('/geraete'),
  getById: (id) => apiClient.get(`/geraete/${id}`),
  create: (geraet) => apiClient.post('/geraete', geraet),
  update: (id, geraet) => apiClient.put(`/geraete/${id}`, geraet),
  delete: (id) => apiClient.delete(`/geraete/${id}`),
};
