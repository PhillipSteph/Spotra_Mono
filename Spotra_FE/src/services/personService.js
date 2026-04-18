import { apiClient } from './apiClient';

export const personService = {
  getAll: () => apiClient.get('/persons'),
  getById: (id) => apiClient.get(`/persons/${id}`),
  create: (person) => apiClient.post('/persons', person),
  update: (id, person) => apiClient.put(`/persons/${id}`, person),
  delete: (id) => apiClient.delete(`/persons/${id}`),
};
