"use client";

import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (categoryData) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setCategories((currentCategories) => [
        data.category,
        ...currentCategories,
      ]);

      return data.category;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id, categoryData) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update category");
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === id ? data.category : category
      )
    );

    return data.category;
  };

  const deleteCategory = async (id) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete category");
    }

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category._id !== id)
    );
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}