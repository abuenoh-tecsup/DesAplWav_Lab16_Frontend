// app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardPage() {
  // Datos hardcodeados
  const tickets = [
    { id: "T-001", title: "Error en login", status: "Abierto" },
    { id: "T-002", title: "No carga el dashboard", status: "En progreso" },
    { id: "T-003", title: "Solicitud de nueva feature", status: "Cerrado" },
  ];

  const stats = {
    abiertos: 5,
    enProgreso: 2,
    cerrados: 8,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Tarjeta horizontal para crear ticket */}
      <Card className="w-full flex items-center justify-between p-6">
        <div>
          <CardTitle>Crear nuevo ticket</CardTitle>
          <CardDescription>
            Gestiona tus solicitudes o reporta problemas rápidamente.
          </CardDescription>
        </div>
        <Button>Nuevo Ticket</Button>
      </Card>

      <div className="flex gap-6">
        {/* Lista de tickets - 2/3 */}
        <Card className="flex-2 p-6">
          <CardHeader>
            <CardTitle>Mis Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div>
                  <p className="font-semibold">{ticket.title}</p>
                  <p className="text-sm text-gray-500">{ticket.id}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className={`px-2 py-1 rounded ${ticket.status === "Abierto" ? "bg-green-100 text-green-800" : ticket.status === "En progreso" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {ticket.status}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{ticket.status}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Estadísticas - 1/3 */}
        <Card className="flex-1 p-6">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Abiertos: {stats.abiertos}</p>
            <p>En progreso: {stats.enProgreso}</p>
            <p>Cerrados: {stats.cerrados}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
