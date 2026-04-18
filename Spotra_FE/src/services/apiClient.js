const BASE_URL = 'http://localhost:8080/api';

export const handleResponse = async (res) => {
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

export const apiClient = {
  get: (url) => fetch(`${BASE_URL}${url}`).then(handleResponse),
  post: (url, data) => fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  put: (url, data) => fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (url) => fetch(`${BASE_URL}${url}`, { method: 'DELETE' }).then(handleResponse),
};
