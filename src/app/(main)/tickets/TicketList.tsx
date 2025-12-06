"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Ticket } from "@/types";

type Props = {
  tickets: Ticket[];
};

export default function TicketList({ tickets }: Props) {
  if (tickets.length === 0) {
    return <p className="text-center text-gray-500">No hay tickets que coincidan con los filtros</p>;
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
            <CardDescription>
              Status: {ticket.status} | Prioridad: {ticket.priority}
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </div>
  );
}
