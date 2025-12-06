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

    ticketService.getById(ticketId)
      .then(setTicket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <p className="text-center mt-8">Cargando ticket...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!ticket) return <p className="text-center mt-8">Ticket no encontrado</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Columna principal (Info + Progreso) */}
      <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
        <TicketInfoCard ticket={ticket} />
        <TicketProgress status={ticket.status} />
      </div>

      {/* Columna secundaria (Chat) */}
      <div className="col-span-1">
        <TicketChat ticketId={ticket.id} />
      </div>
    </div>
  );
}
