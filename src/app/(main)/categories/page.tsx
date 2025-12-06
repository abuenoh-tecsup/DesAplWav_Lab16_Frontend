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

  // Load categories
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
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda */}
      <div className="lg:col-span-2 space-y-4">
        <CategoryDialog onCreate={handleCreate} />
        <CategoryList 
          categories={categories} 
          onSelect={setSelectedCategory} 
          selectedCategory={selectedCategory} 
        />
      </div>

      {/* Columna derecha */}
      <div>
        {selectedCategory ? (
          <CategoryForm 
            category={selectedCategory} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
          />
        ) : (
          <div className="p-6 border rounded-lg text-gray-500">
            Selecciona una categoría para editarla
          </div>
        )}
      </div>
    </div>
  );
}
