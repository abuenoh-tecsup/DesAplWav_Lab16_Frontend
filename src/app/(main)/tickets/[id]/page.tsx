"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Ticket } from "@/types";
import { ticketService } from "@/services/ticketService";

import TicketInfoCard from "./TicketInfoCard";
import TicketProgress from "./TicketProgress";
import TicketChat from "./TicketChat";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    ticketService
      .getById(ticketId)
      .then(setTicket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <p className="text-center mt-8">Cargando ticket...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!ticket) return <p className="text-center mt-8">Ticket no encontrado</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {/* Columna izquierda: Info + Progreso */}
      <div className="flex flex-col gap-6 h-full">
        <TicketInfoCard ticket={ticket} className="flex-1 max-h-full" />
        <TicketProgress
          status={ticket.status}
          className="flex-1 max-h-full overflow-auto"
        />
      </div>

      {/* Columna derecha: Chat */}
      <div className="flex flex-col h-full">
        <TicketChat
          ticketId={ticket.id}
          className="flex-1 max-h-full overflow-auto"
        />
      </div>
    </div>
  );
}
