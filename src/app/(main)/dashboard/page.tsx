"use client";

import { useEffect, useState } from "react";
import CreateTicketCard from "./CreateTicketCard";
import TicketListCard from "./TicketListCard";
import StatsCard from "./StatsCard";
import { ticketService } from "@/services/ticketService";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔒 Verificar sesión al montar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          // No autenticado → login
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data);

        // Redirigir según rol
        if (data.role === "ADMIN") router.push("/assignTicket");
        else if (data.role === "AGENT") router.push("/agent");
        // USER se queda en dashboard
      } catch (err) {
        console.error("Error verificando sesión:", err);
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Cargar tickets solo si el usuario es USER
  useEffect(() => {
    if (user?.role === "USER") {
      ticketService
        .getAll()
        .then(setTickets)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!user || user.role !== "USER") {
    // Mientras redirige, no mostrar contenido
    return null;
  }

  // Calcular estadísticas dinámicamente
  const stats = {
    abiertos: tickets.filter((t) => t.status === "OPEN").length,
    enProgreso: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    cerrados: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
      </div>

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
