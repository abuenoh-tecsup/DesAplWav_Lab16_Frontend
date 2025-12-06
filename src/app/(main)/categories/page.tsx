"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient("/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await apiClient("/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        setNewCategory("");
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear categoría");
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("Error al crear categoría");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const response = await apiClient(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditName("");
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar categoría");
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      alert("Error al actualizar categoría");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      const response = await apiClient(`/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || "Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("Error al eliminar categoría");
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Gestión de Categorías</h1>

      {/* Formulario de creación */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Crear Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4">
            <div className="flex-1">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de la categoría"
                required
              />
            </div>
            <Button type="submit">Crear</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay categorías creadas
            </p>
          ) : (
            <div className="space-y-4">
              {Array.isArray(categories) && categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {editingId === category.id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(category.id)}
                      >
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-semibold">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Creada el{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(category)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category.id)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
