import { apiClient } from "@/lib/api";

const BASE = "/categories";

export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    const res = await apiClient(`${BASE}`);
    if (!res.ok) throw new Error("Error obteniendo categorías");
    return res.json();
  },

  // Obtener categoría por ID
  getById: async (id: string) => {
    const res = await apiClient(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Error obteniendo categoría");
    return res.json();
  },

  // Crear categoría
  create: async (payload: { name: string }) => {
    const res = await apiClient(`${BASE}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error creando categoría");
    return res.json();
  },

  // Actualizar categoría
  update: async (id: string, payload: { name: string }) => {
    const res = await apiClient(`${BASE}/${id}`, {
      method: "PATCH",  // ← Cambiado a PATCH
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error actualizando categoría");
    return res.json();
  },

  // Eliminar categoría
  delete: async (id: string) => {
    const res = await apiClient(`${BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error eliminando categoría");
    return res.json();
  },
};
