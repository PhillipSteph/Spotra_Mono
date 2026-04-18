const BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed with status ${res.status}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

export const geraeteApi = {
  getAll: () => fetch(`${BASE_URL}/geraete`).then(handleResponse),
  create: (geraet) => fetch(`${BASE_URL}/geraete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geraet)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/geraete/${id}`, { method: 'DELETE' }).then(handleResponse),
  getEinheiten: (id) => fetch(`${BASE_URL}/geraete/${id}/einheiten`).then(handleResponse),
};

export const einheitenApi = {
  getAll: () => fetch(`${BASE_URL}/einheiten`).then(handleResponse),
  create: (geraetId) => fetch(`${BASE_URL}/einheiten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geraet: { id: geraetId } }) // Entsprechend der ersten Spezifikation
  }).then(handleResponse),
};

export const saetzeApi = {
  create: (einheitId, satz) => fetch(`${BASE_URL}/saetze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        gewicht: satz.gewicht,
        wiederholungen: satz.wiederholungen,
        einheit: { id: einheitId }
    })
  }).then(handleResponse),
  update: (id, satz) => fetch(`${BASE_URL}/saetze/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(satz)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/saetze/${id}`, { method: 'DELETE' }).then(handleResponse),
};
