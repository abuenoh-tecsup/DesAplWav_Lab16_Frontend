"use client";

import { useEffect, useState } from "react";
import CreateTicketCard from "./CreateTicketCard";
import TicketListCard from "./TicketListCard";
import StatsCard from "./StatsCard";
import { ticketService } from "@/services/ticketService";
import { Ticket, TicketStatus } from "@/types";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getAll()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calcular estadísticas dinámicamente
  const stats = {
    abiertos: tickets.filter((t) => t.status === "OPEN").length,
    enProgreso: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    cerrados: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Tarjeta de creación de ticket */}
      <CreateTicketCard />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lista de tickets - 2/3 */}
        <div className="lg:flex-2">
          <TicketListCard tickets={tickets} loading={loading} />
        </div>

        {/* Estadísticas - 1/3 */}
        <div className="lg:flex-1">
          <StatsCard stats={stats} />
        </div>
      </div>
    </div>
  );
}
