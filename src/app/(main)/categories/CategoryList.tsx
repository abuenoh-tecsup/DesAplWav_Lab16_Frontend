"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Category } from "@/types";

type Props = {
  categories: Category[];
  onSelect: (category: Category) => void;
  selectedCategory: Category | null;
};

export default function CategoryList({ categories, onSelect, selectedCategory }: Props) {
  if (!categories.length) return <p>No hay categorías</p>;

  return (
    <Card className="p-4 space-y-2">
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedCategory?.id === cat.id ? "bg-blue-50 border border-blue-400" : ""
            }`}
            onClick={() => onSelect(cat)}
          >
            {cat.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
