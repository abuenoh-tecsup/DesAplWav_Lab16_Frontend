"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  statusFilter: string;
  priorityFilter: string;
  setStatusFilter: (value: string) => void;
  setPriorityFilter: (value: string) => void;
};

export default function TicketFilters({
  statusFilter,
  priorityFilter,
  setStatusFilter,
  setPriorityFilter,
}: Props) {
  return (
    <div className="flex gap-6">
      {/* Status Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Estado</label>
        <Select
          value={statusFilter || "ALL"}
          onValueChange={(val) => setStatusFilter(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecciona Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="OPEN">Abierto</SelectItem>
            <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
            <SelectItem value="RESOLVED">Resuelto</SelectItem>
            <SelectItem value="CLOSED">Cerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Prioridad</label>
        <Select
          value={priorityFilter || "ALL"}
          onValueChange={(val) => setPriorityFilter(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecciona Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="LOW">Baja</SelectItem>
            <SelectItem value="MEDIUM">Media</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
