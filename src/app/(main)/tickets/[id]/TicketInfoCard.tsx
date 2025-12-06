"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Ticket } from "@/types";

type Props = { ticket: Ticket };

// Colores indicativos de status
const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

// Colores indicativos de prioridad
const priorityColors: Record<string, string> = {
  LOW: "bg-green-200 text-green-900",
  MEDIUM: "bg-yellow-200 text-yellow-900",
  HIGH: "bg-red-200 text-red-900",
};

export default function TicketInfoCard({ ticket }: Props) {
  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-xl font-semibold">{ticket.title}</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[ticket.status]}`}>
            {ticket.status}
          </span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
          <span className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
            Categoría: {ticket.Category?.name}
          </span>
        </div>
      </CardHeader>
      <CardContent className="mt-4 space-y-2">
        <p className="text-gray-700">{ticket.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span>Creado: {new Date(ticket.createdAt).toLocaleString()}</span>
          <span>Actualizado: {new Date(ticket.updatedAt).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
