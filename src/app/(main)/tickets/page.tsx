"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  agent?: {
    name: string;
  };
  Category: {
    name: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await apiClient("/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error al cargar tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      (!statusFilter || t.status === statusFilter) &&
      (!priorityFilter || t.priority === priorityFilter)
  );

  const handleTicketClick = (id: string) => {
    router.push(`/tickets/${id}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando tickets...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button onClick={() => router.push("/tickets/new")}>
          Crear Ticket
        </Button>
      </div>

      <Separator />

      <div className="flex gap-4">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="RESOLVED">Resuelto</option>
          <option value="CLOSED">Cerrado</option>
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleTicketClick(ticket.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {ticket.description.substring(0, 100)}
                    {ticket.description.length > 100 ? "..." : ""}
                  </CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {STATUS_LABELS[ticket.status]}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                    {PRIORITY_LABELS[ticket.priority]}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p>Categoría: {ticket.Category.name}</p>
                  <p>Creado por: {ticket.user.name}</p>
                </div>
                <div className="text-right space-y-1">
                  {ticket.agent && <p>Agente: {ticket.agent.name}</p>}
                  <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {tickets.length === 0 
              ? "No hay tickets creados. ¡Crea el primero!" 
              : "No hay tickets que coincidan con los filtros"}
          </p>
        )}
      </div>
    </div>
  );
}
