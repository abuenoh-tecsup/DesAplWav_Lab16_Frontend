"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Ticket } from "@/types";

type Props = { tickets: Ticket[]; loading: boolean };

export default function TicketListCard({ tickets, loading }: Props) {
  if (loading) return <p>Cargando tickets...</p>;
  if (!tickets.length) return <p>No hay tickets disponibles</p>;

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
    <Card className="flex-1 p-6">
      <CardHeader>
        <CardTitle>Mis Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow rounded-lg">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg">{ticket.title}</p>
                <p className="text-sm text-gray-500">{ticket.Category?.name || "Sin categoría"}</p>
                <p className="text-sm text-gray-500 mt-1">Prioridad: {ticket.priority}</p>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor(ticket.status)}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{ticket.status}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
