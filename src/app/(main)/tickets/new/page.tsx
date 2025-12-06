"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Intentando cargar categorías...");
      const response = await apiClient("/categories");
      console.log("Respuesta:", response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Categorías recibidas:", data);
        setCategories(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error("Error al cargar categorías:", response.status, errorText);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient("/tickets", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/tickets");
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear el ticket");
      }
    } catch (error) {
      console.error("Error al crear ticket:", error);
      alert("Error al crear el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket</CardTitle>
          <CardDescription>
            Completa el formulario para crear un ticket de soporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Describe brevemente el problema"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                placeholder="Describe el problema en detalle"
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría *</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="">Selecciona una categoría</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Ticket"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/tickets")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
