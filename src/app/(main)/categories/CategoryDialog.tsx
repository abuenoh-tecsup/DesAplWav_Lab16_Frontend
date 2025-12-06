"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";

type Props = { onCreate: (category: Category) => void };

export default function CategoryDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      const newCat = await categoryService.create({ name });
      onCreate(newCat);
      setName("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error creando categoría");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nueva Categoría</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Categoría</DialogTitle>
        </DialogHeader>
        <Input 
          placeholder="Nombre de la categoría" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
