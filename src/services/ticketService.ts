import { apiClient } from "@/lib/api";

const BASE = "/tickets";

export const ticketService = {
  // ------------------- CRUD -------------------

  getAll: async () => {
    const res = await apiClient(`${BASE}`);
    if (!res.ok) throw new Error("Error obteniendo tickets");
    return res.json();
  },

  getById: async (id: string) => {
    const res = await apiClient(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Error obteniendo ticket");
    return res.json();
  },

  create: async (payload: {
    title: string;
    description: string;
    categoryId: string;
    agentId?: string;
    status?: string;
    priority?: string;
  }) => {
    const res = await apiClient(`${BASE}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error creando ticket");
    return res.json();
  },

  update: async (id: string, payload: {
    title?: string;
    description?: string;
    categoryId?: string;
    agentId?: string;
    status?: string;
    priority?: string;
  }) => {
    const res = await apiClient(`${BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error actualizando ticket");
    return res.json();
  },

  delete: async (id: string) => {
    const res = await apiClient(`${BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error eliminando ticket");
    return res.json();
  },

  // ------------------- Mensajes -------------------

  addMessage: async (
    ticketId: string,
    payload: { content: string } // solo enviamos el contenido
  ) => {
    const res = await apiClient(`${BASE}/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error agregando mensaje");
    return res.json();
  },

  getMessages: async (ticketId: string) => {
    const res = await apiClient(`${BASE}/${ticketId}/messages`);
    if (!res.ok) throw new Error("Error obteniendo mensajes");
    return res.json();
  },
};
