"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";
import CategoryList from "./CategoryList";
import CategoryDialog from "./CategoryDialog";
import CategoryForm from "./CategoryForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Cargar categorías
  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleCreate = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleUpdate = (updated: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updated.id ? updated : cat))
    );
    setSelectedCategory(updated);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setSelectedCategory(null);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      {/* Dialog ocupa todo el ancho */}
      <div>
        <CategoryDialog onCreate={handleCreate} />
      </div>

      {/* Contenedor horizontal: listado + formulario */}
      <div className="flex gap-6">
        {/* Listado */}
        <div className="flex-1 h-[70vh] overflow-auto">
          <CategoryList 
            categories={categories} 
            onSelect={setSelectedCategory} 
            selectedCategory={selectedCategory} 
          />
        </div>

        {/* Formulario de edición */}
        <div className="flex-1 h-[70vh]">
          {selectedCategory ? (
            <CategoryForm 
              category={selectedCategory} 
              onUpdate={handleUpdate} 
              onDelete={handleDelete} 
            />
          ) : (
            <div className="p-6 border rounded-lg text-gray-500 h-full flex items-center justify-center">
              Selecciona una categoría para editarla
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
