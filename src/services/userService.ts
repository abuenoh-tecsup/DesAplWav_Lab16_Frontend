import { apiClient } from "@/lib/api";

const BASE = "/users";

export const userService = {
  // Obtener todos los usuarios (solo ADMIN)
  getAll: async () => {
    const res = await apiClient(`${BASE}`);
    if (!res.ok) throw new Error("Error obteniendo usuarios");
    return res.json();
  },

  // Obtener el usuario actual (autenticado por cookie HttpOnly)
  me: async () => {
    const res = await apiClient(`${BASE}/me`);
    if (!res.ok) throw new Error("Error obteniendo usuario actual");
    return res.json();
  }
};
