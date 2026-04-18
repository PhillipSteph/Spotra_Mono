import { apiClient } from './apiClient';

export const saetzeService = {
  create: (einheitId, satz) => apiClient.post('/saetze', {
    ...satz,
    einheit: { id: einheitId }
  }),
  update: (id, satz) => apiClient.put(`/saetze/${id}`, satz),
  delete: (id) => apiClient.delete(`/saetze/${id}`),
};
