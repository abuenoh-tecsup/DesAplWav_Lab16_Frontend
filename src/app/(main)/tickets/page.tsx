"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticketService";
import { categoryService } from "@/services/categoryService";
import TicketDialog from "./TicketDialog";
import TicketFilters from "./TicketFilters";
import TicketList from "./TicketList";
import { Category, Ticket } from "@/types";
import { CreateTicketInput } from "@/types/types";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // ------------------- LOAD DATA -------------------
  useEffect(() => {
    ticketService.getAll().then(setTickets).catch(console.error);
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const filteredTickets = tickets.filter(
    (t) =>
      (!statusFilter || t.status === statusFilter) &&
      (!priorityFilter || t.priority === priorityFilter)
  );

  const handleCreateTicket = async (input: CreateTicketInput) => {
    try {
      // 1️⃣ Llamar al backend para crear el ticket y obtener el Ticket completo
      const newTicket: Ticket = await ticketService.create(input);

      // 2️⃣ Agregarlo a la lista
      setTickets((prev) => [...prev, newTicket]);
    } catch (err) {
      console.error(err);
      alert("Error creando ticket");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <TicketDialog categories={categories} onCreate={handleCreateTicket} />
      </div>

      <hr />

      <TicketFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        setStatusFilter={setStatusFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <TicketList tickets={filteredTickets} />
    </div>
  );
}
