"use client";

import { useState } from "react";
import { toast } from "sonner";

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

export default function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskDeleted,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (event) => {
    // Prevent dialog from closing before API request completes
    event.preventDefault();

    if (!task?._id) {
      toast.error("Task ID is missing");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/tasks/${task._id}`,
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
            "Failed to delete task"
        );
      }

      toast.success("Task deleted successfully");

      // Refresh task list
      if (onTaskDeleted) {
        await onTaskDeleted();
      }

      // Close dialog
      onOpenChange(false);

    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete task"
      );
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
            Delete Task?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{task?.title}"
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
            {loading
              ? "Deleting..."
              : "Delete Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}