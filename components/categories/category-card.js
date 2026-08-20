"use client";

import { useState } from "react";

import {
  Tag,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CategoryForm from "./category-form";

export default function CategoryCard({
  category,
  onCategoryDeleted,
}) {
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!category?._id) {
      toast.error("Category ID is missing");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/categories/${category._id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes("application/json")
          ? await response.json()
          : {};

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to delete category"
        );
      }

      toast.success("Category deleted successfully");

      // Refresh category list
      if (onCategoryDeleted) {
        await onCategoryDeleted();
      }

      setDeleteOpen(false);
    } catch (error) {
      console.error(
        "Error deleting category:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete category"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CATEGORY UPDATED
  // ==========================================

  const handleCategoryUpdated = async () => {
    if (onCategoryDeleted) {
      await onCategoryDeleted();
    }

    toast.success("Category updated successfully");

    setEditing(false);
  };

  return (
    <>
      <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="flex items-center justify-between gap-3 p-5">
          
          {/* CATEGORY INFO */}

          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold">
                {category.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                Task category
              </p>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={() => setEditing(true)}
              title="Edit category"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={() => setDeleteOpen(true)}
              className="hover:text-destructive"
              title="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ======================================
          EDIT CATEGORY
      ====================================== */}

      <CategoryForm
        category={category}
        open={editing}
        onOpenChange={setEditing}
        onCategoryCreated={handleCategoryUpdated}
      />

      {/* ======================================
          DELETE CATEGORY CONFIRMATION
      ====================================== */}

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Category?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{category?.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}