const API_BASE = "http://localhost:5001";
const API_KEY = "dashboard_key_123";

export async function fetchData(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}