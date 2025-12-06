"use client";

import { useState, useEffect } from "react";
import { ticketService } from "@/services/ticketService";
import { userService } from "@/services/userService"; // asumiendo que tienes esto
import { Ticket, User } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function TicketAssigner() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [assignedAgent, setAssignedAgent] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Cargar tickets y agentes al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsData = await ticketService.getAll();
        setTickets(ticketsData);

        const users = await userService.getAll();
        const agentsData = users.filter(
          (u: { role: string }) => u.role === "AGENT"
        );
        setAgents(agentsData);
      } catch (err) {
        console.error("Error cargando tickets o agentes:", err);
      }
    };
    fetchData();
  }, []);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAssignedAgent(ticket.agentId || "");
  };

  const handleAssign = async () => {
    if (!selectedTicket) return;

    setLoading(true);
    try {
      const updated = await ticketService.update(selectedTicket.id, {
        agentId: assignedAgent,
      });

      // Actualizamos el listado
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setSelectedTicket(updated);
      alert("Agente asignado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error asignando agente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Listado de tickets */}
      <div className="w-1/3 overflow-y-auto border rounded p-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => handleSelectTicket(ticket)}
            className={`p-2 rounded mb-2 cursor-pointer ${
              selectedTicket?.id === ticket.id ? "bg-blue-100" : "bg-gray-50"
            }`}
          >
            <p className="font-semibold">{ticket.title}</p>
            <p className="text-sm text-gray-500">{ticket.status}</p>
          </div>
        ))}
      </div>

      {/* Formulario de asignación */}
      <div className="flex-1">
        {selectedTicket ? (
          <Card>
            <CardHeader>
              <CardTitle>Asignar agente</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>
                <strong>Título:</strong> {selectedTicket.title}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedTicket.description}
              </p>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Agente asignado:</label>
                <Select
                  value={assignedAgent}
                  onValueChange={(value) => setAssignedAgent(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Seleccionar agente --" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAssign} disabled={loading}>
                Guardar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p className="text-gray-500">
            Selecciona un ticket para asignar un agente
          </p>
        )}
      </div>
    </div>
  );
}
