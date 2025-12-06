"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { CreateTicketInput } from "@/types/types";

type Props = {
  categories: Category[];
  onCreate: (ticket: CreateTicketInput) => void;
};

export default function TicketDialog({ categories, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  type Priority = "LOW" | "MEDIUM" | "HIGH";
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  // Labels humanizados para prioridad
  const PRIORITY_LABELS: Record<Priority, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  const handleSubmit = () => {
    onCreate({ title, description, categoryId, priority });
    setTitle("");
    setDescription("");
    setCategoryId("");
    setPriority("MEDIUM");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Agregar Ticket</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ingrese un título" />
          </div>

          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingrese la descripción del ticket"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Categoría</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Prioridad</label>
            <Select
              value={priority}
              onValueChange={(value: string) => setPriority(value as Priority)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">{PRIORITY_LABELS.LOW}</SelectItem>
                <SelectItem value="MEDIUM">{PRIORITY_LABELS.MEDIUM}</SelectItem>
                <SelectItem value="HIGH">{PRIORITY_LABELS.HIGH}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Crear Ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
