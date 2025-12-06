"use client";

import { TICKET_STATUS, TicketStatus } from "@/types/index";

type Props = { status: TicketStatus };

// Mensajes explicativos por cada estado
const STATUS_MESSAGES: Record<TicketStatus, string> = {
  OPEN: "El ticket ha sido creado y está pendiente de revisión.",
  IN_PROGRESS: "Un agente está trabajando activamente en este ticket.",
  RESOLVED: "El ticket ha sido resuelto, esperando confirmación.",
  CLOSED: "El ticket está cerrado y completado.",
};

export default function TicketProgress({ status }: Props) {
  const currentIndex = TICKET_STATUS.indexOf(status);

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="font-bold text-lg text-gray-800">Progreso del Ticket</h2>
      
      {/* Checkpoints visuales */}
      <div className="flex justify-around items-center">
        {TICKET_STATUS.map((s, index) => (
          <div key={s} className="flex flex-col items-center">
            {/* Bolita con número */}
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-semibold text-sm ${
                index <= currentIndex
                  ? "bg-blue-600 border-blue-600"
                  : "bg-gray-200 border-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>

            {/* Nombre del estado */}
            <span className="text-xs mt-2 font-medium text-gray-700">{s}</span>
          </div>
        ))}
      </div>

      {/* Mensaje dinámico del estado actual */}
      <p className="text-sm text-gray-500 mt-4 text-center px-4">
        {STATUS_MESSAGES[status]}
      </p>
    </div>
  );
}
