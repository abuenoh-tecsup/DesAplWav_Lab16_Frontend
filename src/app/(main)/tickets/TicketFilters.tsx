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
    <div className="flex gap-4">
      {/* Status Filter */}
      <Select
        value={statusFilter || "ALL"}
        onValueChange={(val) => setStatusFilter(val === "ALL" ? "" : val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="OPEN">OPEN</SelectItem>
          <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
          <SelectItem value="RESOLVED">RESOLVED</SelectItem>
          <SelectItem value="CLOSED">CLOSED</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={priorityFilter || "ALL"}
        onValueChange={(val) => setPriorityFilter(val === "ALL" ? "" : val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="LOW">LOW</SelectItem>
          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
          <SelectItem value="HIGH">HIGH</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
