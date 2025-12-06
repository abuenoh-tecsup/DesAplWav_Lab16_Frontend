"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";

type Props = { tickets: Ticket[] };

export default function TicketList({ tickets }: Props) {
  const router = useRouter();

  if (tickets.length === 0) {
    return <p className="text-center text-gray-500">No hay tickets que coincidan con los filtros</p>;
  }

  const statusLabels: Record<Ticket["status"], string> = {
    OPEN: "Abierto",
    IN_PROGRESS: "En progreso",
    RESOLVED: "Resuelto",
    CLOSED: "Cerrado",
  };

  const statusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-blue-100 text-blue-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const priorityLabels: Record<Ticket["priority"], string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  const priorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-green-200 text-green-900";
      case "MEDIUM":
        return "bg-yellow-200 text-yellow-900";
      case "HIGH":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg"
          onClick={() => router.push(`/tickets/${ticket.id}`)}
        >
          <CardHeader className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {ticket.Category?.name || "Sin categoría"}
              </CardDescription>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(ticket.status)}`}
              >
                {statusLabels[ticket.status] || ticket.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor(ticket.priority)}`}
              >
                {priorityLabels[ticket.priority] || ticket.priority}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700">
              {ticket.description.length > 120
                ? ticket.description.substring(0, 120) + "..."
                : ticket.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
