"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";

type Props = {
  category: Category;
  onUpdate: (category: Category) => void;
  onDelete: (id: string) => void;
};

export default function CategoryForm({ category, onUpdate, onDelete }: Props) {
  const [name, setName] = useState(category.name);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(category.name);
  }, [category]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await categoryService.update(category.id, { name });
      onUpdate(updated);
    } catch (err) {
      console.error(err);
      alert("Error actualizando categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    setLoading(true);
    try {
      await categoryService.delete(category.id);
      onDelete(category.id);
    } catch (err) {
      console.error(err);
      alert("Error eliminando categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <CardHeader>
        <CardTitle>Editar Categoría</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            Guardar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
