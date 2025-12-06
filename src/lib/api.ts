const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:4000/api";

export async function apiClient(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Intentar obtener el token de localStorage (para desarrollo con backend remoto)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('backendToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // enviar cookies httpOnly
    headers,
  });
}
