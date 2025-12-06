"use client";

import { TICKET_STATUS, TicketStatus } from "@/types/index";

type Props = { status: TicketStatus; className?: string };

const STATUS_MESSAGES: Record<TicketStatus, string> = {
  OPEN: "El ticket ha sido creado y está pendiente de revisión.",
  IN_PROGRESS: "Un agente está trabajando activamente en este ticket.",
  RESOLVED: "El ticket ha sido resuelto, esperando confirmación.",
  CLOSED: "El ticket está cerrado y completado.",
};

// Labels humanizados
const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

export default function TicketProgress({ status, className }: Props) {
  const currentIndex = TICKET_STATUS.indexOf(status);

  return (
    <div className={`p-6 bg-white rounded-lg shadow flex flex-col h-full space-y-6 ${className ?? ""}`}>
      <h2 className="font-bold text-xl text-gray-800 text-center">Progreso del Ticket</h2>

      <div className="flex justify-between items-center flex-1 relative px-4">
        {TICKET_STATUS.map((s, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={s} className="flex flex-col items-center relative flex-1">
              {/* Línea horizontal */}
              {index < TICKET_STATUS.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 h-1 ${
                    index < currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  style={{ width: 'calc(100% - 40px)', marginLeft: '20px', zIndex: 0 }}
                />
              )}
              {/* Bolita */}
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-base transition-colors relative ${
                  isActive ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-200 border-gray-300 text-gray-600"
                }`}
                style={{ zIndex: 1 }}
              >
                {index + 1}
              </div>
              {/* Label humanizado */}
              <span className="text-sm mt-2 font-medium text-gray-700 text-center">
                {STATUS_LABELS[s] ?? s}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4 text-center px-2">{STATUS_MESSAGES[status]}</p>
    </div>
  );
}
