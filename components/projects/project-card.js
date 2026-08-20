"use client";

import { useState } from "react";

import {
  CalendarDays,
  FileText,
  FolderKanban,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

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

export default function ProjectCard({
  project,
  onProjectUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!project?._id) {
      toast.error("Project ID is missing");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${project._id}`,
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
            "Failed to delete project"
        );
      }

      toast.success(
        "Project deleted successfully"
      );

      // Refresh project list
      if (onProjectUpdated) {
        await onProjectUpdated();
      }

      // Close dialog
      setDeleteOpen(false);

    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete project"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formattedDate = project.createdAt
    ? new Date(
        project.createdAt
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently created";

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">
                {project.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                Project workspace
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            onClick={() => setDeleteOpen(true)}
            className="shrink-0 opacity-70 transition-opacity hover:text-destructive group-hover:opacity-100"
            title="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* DESCRIPTION */}

          <div className="flex gap-3 text-sm text-muted-foreground">
            <FileText className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="line-clamp-2">
              {project.description ||
                "No description added for this project yet."}
            </p>
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />

              <span>
                Created {formattedDate}
              </span>
            </div>

            <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              Active
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==========================================
          DELETE CONFIRMATION DIALOG
      ========================================== */}

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Project?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{project?.name}"
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
                : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}