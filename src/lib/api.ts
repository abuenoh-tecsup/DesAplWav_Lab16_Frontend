const API_URL = "http://localhost:4000/api";

export async function apiClient(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // enviar cookies httpOnly
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}
