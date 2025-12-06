"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticketService";
import { Ticket } from "@/types";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";

export default function CalendarPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    ticketService.getAll().then(setTickets).catch(console.error);
  }, []);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = Array.from({ length: end.getDate() }, (_, i) =>
    addDays(start, i)
  );

  // Agrupar tickets por día
  const ticketsByDay: Record<string, Ticket[]> = {};
  tickets.forEach((t) => {
    const day = format(new Date(t.createdAt), "yyyy-MM-dd");
    if (!ticketsByDay[day]) ticketsByDay[day] = [];
    ticketsByDay[day].push(t);
  });

  const MAX_VISIBLE_TICKETS = 3;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Calendario de Tickets</h1>
      <div className="grid grid-cols-7 gap-2">
        {/* Cabecera de días */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="text-center font-medium">{d}</div>
        ))}

        {/* Rellenar espacios hasta el primer día */}
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Dias del mes */}
        {daysInMonth.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTickets = ticketsByDay[dayKey] || [];
          const visibleTickets = dayTickets.slice(0, MAX_VISIBLE_TICKETS);
          const hiddenCount = dayTickets.length - MAX_VISIBLE_TICKETS;

          return (
            <div
              key={dayKey}
              className="border p-1 h-28 relative overflow-hidden rounded-md hover:bg-gray-100 cursor-pointer flex flex-col"
            >
              {/* Número del día */}
              <div className="text-sm font-bold mb-1">{day.getDate()}</div>

              {/* Tickets como mini barras */}
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {visibleTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-blue-500 text-white text-xs rounded px-1 truncate"
                  >
                    {t.title}
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <div className="bg-gray-300 text-gray-700 text-xs rounded px-1">
                    +{hiddenCount} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
