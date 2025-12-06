"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ticket } from "@/types";

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-green-200 text-green-900",
  MEDIUM: "bg-yellow-200 text-yellow-900",
  HIGH: "bg-red-200 text-red-900",
};

type Props = { ticket: Ticket; className?: string };

export default function TicketInfoCard({ ticket, className }: Props) {
  return (
    <Card className={`shadow-lg border border-gray-200 h-full flex flex-col ${className ?? ""}`}>
      {/* Header: título y etiquetas */}
      <CardHeader className="flex flex-col gap-3 p-6">
        <CardTitle className="text-2xl font-bold">{ticket.title}</CardTitle>
        <div className="flex flex-wrap gap-3">
          {ticket.status && (
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[ticket.status] ?? "bg-gray-100 text-gray-800"}`}>
              {ticket.status}
            </span>
          )}
          {ticket.priority && (
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${priorityColors[ticket.priority] ?? "bg-gray-100 text-gray-800"}`}>
              {ticket.priority}
            </span>
          )}
          {ticket.Category?.name && (
            <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-100 text-gray-800">
              Categoría: {ticket.Category.name}
            </span>
          )}
        </div>
      </CardHeader>

      {/* Contenido principal */}
      <CardContent className="flex-1 flex flex-col justify-between p-6 space-y-4">
        <p className="text-gray-800 text-base flex-1">{ticket.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span>Creado: {new Date(ticket.createdAt).toLocaleString()}</span>
          <span>Actualizado: {new Date(ticket.updatedAt).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
