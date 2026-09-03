const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body.error ?? "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return body;
}

export function login(credentials) {
  return api("/api/login", { method: "POST", body: JSON.stringify(credentials) });
}
export function submitFeedback(feedback) {
  return api("/api/feedback", { method: "POST", body: JSON.stringify(feedback) });
}
export function getFeedback(token, filters = {}) {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.status) query.set("status", filters.status);
  const suffix = query.size ? `?${query}` : "";
  return api(`/api/feedback${suffix}`, { headers: { Authorization: `Bearer ${token}` } });
}
