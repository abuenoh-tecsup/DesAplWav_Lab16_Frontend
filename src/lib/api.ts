const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function apiClient(path: string, options: RequestInit = {}) {
  return fetch(`${BACKEND_URL}/api${path}`, {
    ...options,
    credentials: "include", // enviar cookies httpOnly
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}
