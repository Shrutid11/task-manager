"use client";

import CategoryCard from "./category-card";

export default function CategoryList({
  categories = [],
  onCategoryDeleted,
}) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-muted-foreground">
          No categories yet. Create your first category!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          onCategoryDeleted={onCategoryDeleted}
        />
      ))}
    </div>
  );
}