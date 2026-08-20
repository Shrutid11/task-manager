"use client";

import { useState } from "react";

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

export default function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectDeleted,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!project?._id) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${project._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      if (onProjectDeleted) {
        await onProjectDeleted();
      }

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      alert("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Project?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete "
            {project?.name}"?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}