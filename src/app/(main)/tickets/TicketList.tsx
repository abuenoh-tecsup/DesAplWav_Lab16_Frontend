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
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700">{ticket.description.substring(0, 120)}{ticket.description.length > 120 ? "..." : ""}</p>
            <p className="mt-2 text-sm text-gray-500">Prioridad: {ticket.priority}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
