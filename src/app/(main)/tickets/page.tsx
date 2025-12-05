"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Ticket = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

const ticketsData: Ticket[] = [
  { id: "1", title: "Error en login", status: "OPEN", priority: "HIGH" },
  { id: "2", title: "No carga página dashboard", status: "IN_PROGRESS", priority: "MEDIUM" },
  { id: "3", title: "Agregar funcionalidad export PDF", status: "RESOLVED", priority: "LOW" },
  { id: "4", title: "Actualizar estilos", status: "CLOSED", priority: "MEDIUM" },
];

export default function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const filteredTickets = ticketsData.filter(
    (t) =>
      (!statusFilter || t.status === statusFilter) &&
      (!priorityFilter || t.priority === priorityFilter)
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button>Agregar Ticket</Button>
      </div>

      <Separator />

      <div className="flex gap-4">
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filtrar por Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Filtrar por Prioridad</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.title}</CardTitle>
              <CardDescription>
                Status: {ticket.status} | Prioridad: {ticket.priority}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí podrías agregar detalles del ticket o acciones */}
            </CardContent>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <p className="text-center text-gray-500">No hay tickets que coincidan con los filtros</p>
        )}
      </div>
    </div>
  );
}
