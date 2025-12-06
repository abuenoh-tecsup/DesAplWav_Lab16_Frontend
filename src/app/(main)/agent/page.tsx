"use client";

import { useState, useEffect } from "react";
import { ticketService } from "@/services/ticketService";
import { Ticket, Message, TICKET_STATUS } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TicketChat from "@/app/(main)/tickets/[id]/TicketChat";

export default function AgentPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState<Ticket["status"]>("OPEN");
  const [loading, setLoading] = useState(false);

  // Cargar tickets asignados al agente
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAll();
        setTickets(data);
      } catch (err) {
        console.error("Error cargando tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;

    setLoading(true);
    try {
      const updated = await ticketService.update(selectedTicket.id, { status });
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setSelectedTicket(updated);
      alert("Estado actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error actualizando el estado");
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

      {/* Detalle del ticket */}
      <div className="flex-1 space-y-4">
        {selectedTicket ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Detalle del Ticket</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>
                  <strong>Título:</strong> {selectedTicket.title}
                </p>
                <p>
                  <strong>Descripción:</strong> {selectedTicket.description}
                </p>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Estado:</label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(
                        value as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_STATUS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleUpdateStatus} disabled={loading}>
                  Guardar Estado
                </Button>
              </CardContent>
            </Card>

            <TicketChat ticketId={selectedTicket.id} />
          </>
        ) : (
          <p className="text-gray-500">
            Selecciona un ticket para ver su detalle
          </p>
        )}
      </div>
    </div>
  );
}
