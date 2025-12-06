// src/types/index.ts

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT" | "USER";
  createdAt: string;
  updatedAt: string;
};

export const TICKET_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export type TicketStatus = (typeof TICKET_STATUS)[number];

export const PRIORITY = ["LOW", "MEDIUM", "HIGH"] as const;
export type Priority = (typeof PRIORITY)[number];

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  categoryId: string;
  category?: Category;
  userId: string;      // creador
  agentId?: string;    // asignado
  createdAt: string;
  updatedAt: string;
};
