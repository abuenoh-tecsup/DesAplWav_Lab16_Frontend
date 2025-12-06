// types.ts
export type CreateTicketInput = {
  title: string;
  description: string;
  categoryId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};
