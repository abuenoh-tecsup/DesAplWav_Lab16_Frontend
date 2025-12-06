"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticketService";
import { Ticket } from "@/types";
import {
  addDays,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
  addMonths,
} from "date-fns";

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

  const ticketsByDay: Record<string, Ticket[]> = {};
  tickets.forEach((t) => {
    const day = format(new Date(t.createdAt), "yyyy-MM-dd");
    if (!ticketsByDay[day]) ticketsByDay[day] = [];
    ticketsByDay[day].push(t);
  });

  const MAX_VISIBLE_TICKETS = 3;

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="p-8">
      {/* Header del calendario */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          {"<"} Mes anterior
        </button>
        <h1 className="text-2xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Mes siguiente {">"}
        </button>
      </div>

      {/* Cabecera de días */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Rellenar espacios hasta el primer día */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Días del mes */}
        {daysInMonth.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTickets = ticketsByDay[dayKey] || [];
          const visibleTickets = dayTickets.slice(0, MAX_VISIBLE_TICKETS);
          const hiddenCount = dayTickets.length - MAX_VISIBLE_TICKETS;

          return (
            <div
              key={dayKey}
              className="border border-black p-2 h-32 rounded-lg flex flex-col overflow-hidden 
             bg-gray-100 hover:bg-gray-700 hover:text-white transition duration-200 cursor-pointer"
            >
              {/* Número del día */}
              <div className="text-sm font-bold mb-1">{day.getDate()}</div>

              {/* Tickets */}
              <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                {visibleTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-blue-600 text-white text-xs rounded px-1 truncate"
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <div className="bg-gray-400 text-white text-xs rounded px-1">
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
