"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoryForm({
  category,
  open: controlledOpen,
  onOpenChange,
  onCategoryCreated,
}) {
  const [internalOpen, setInternalOpen] =
    useState(false);

  const [name, setName] = useState(
    category?.name || ""
  );

  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(category?._id);

  const open = isEditing
    ? controlledOpen
    : internalOpen;

  const setOpen = isEditing
    ? onOpenChange
    : setInternalOpen;

  // Update input when selecting a different category
  useEffect(() => {
    setName(category?.name || "");
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `/api/categories/${category._id}`
        : "/api/categories";

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes("application/json")
          ? await response.json()
          : {};

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing
              ? "Failed to update category"
              : "Failed to create category")
        );
      }

      // Refresh category list
      if (onCategoryCreated) {
        await onCategoryCreated(data);
      }

      if (!isEditing) {
        setName("");
      }

      setOpen(false);

    } catch (error) {
      console.error(
        "Error saving category:",
        error
      );

      alert(
        error.message ||
          (isEditing
            ? "Failed to update category"
            : "Failed to create category")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = (value) => {
    if (!loading) {
      setOpen(value);

      if (!value && !isEditing) {
        setName("");
      }
    }
  };

  return (
    <>
      {/* CREATE CATEGORY BUTTON */}
      {!isEditing && (
        <Button
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={handleDialogChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Edit Category"
                : "Create New Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName(
                    category?.name || ""
                  );

                  setOpen(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Save Changes"
                  : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}