"use client";

import { useState } from "react";

import {
  CalendarDays,
  FolderKanban,
  Tag,
  Pencil,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import TaskForm from "./task-form";

export default function TaskDetails({
  task = null,
  projects = [],
  categories = [],
  open = false,
  onOpenChange,
  onTaskUpdated,
}) {
  const [editing, setEditing] = useState(false);

  // ==========================================
  // SAFE ID
  // ==========================================

  const getId = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return String(
        value._id ||
        value.id ||
        ""
      );
    }

    return String(value);
  };

  // ==========================================
  // PROJECT NAME
  // ==========================================

  const getProjectName = () => {
    if (!task?.project) {
      return null;
    }

    if (typeof task.project === "object") {
      return task.project?.name || null;
    }

    const project = projects.find(
      (item) =>
        getId(item) === getId(task.project)
    );

    return project?.name || null;
  };

  // ==========================================
  // CATEGORY NAME
  // ==========================================

  const getCategoryName = () => {
    if (!task?.category) {
      return null;
    }

    if (typeof task.category === "object") {
      return task.category?.name || null;
    }

    const category = categories.find(
      (item) =>
        getId(item) === getId(task.category)
    );

    return category?.name || null;
  };

  // ==========================================
  // STATUS CONFIG
  // ==========================================

  const statusConfig = {
    todo: {
      label: "To Do",
      icon: Circle,
      variant: "secondary",
    },

    "in-progress": {
      label: "In Progress",
      icon: Clock,
      variant: "default",
    },

    completed: {
      label: "Completed",
      icon: CheckCircle2,
      variant: "secondary",
    },
  };

  // ==========================================
  // PRIORITY CONFIG
  // ==========================================

  const priorityVariant = {
    low: "secondary",
    medium: "default",
    high: "destructive",
  };

  if (!task) {
    return null;
  }

  const status =
    statusConfig[task.status] ||
    statusConfig.todo;

  const StatusIcon = status.icon;

  const projectName = getProjectName();
  const categoryName = getCategoryName();

  // ==========================================
  // TASK UPDATED
  // ==========================================

  const handleTaskUpdated = async (
    updatedTask
  ) => {
    try {
      if (onTaskUpdated) {
        await onTaskUpdated(updatedTask);
      }

      setEditing(false);

      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error(
        "Error refreshing task:",
        error
      );
    }
  };

  // ==========================================
  // DIALOG OPEN CHANGE
  // ==========================================

  const handleOpenChange = (value) => {
    if (!value) {
      setEditing(false);
    }

    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Edit Task"
              : "Task Details"}
          </DialogTitle>
        </DialogHeader>

        {/* ====================================== */}
        {/* EDIT MODE */}
        {/* ====================================== */}

        {editing ? (
          <TaskForm
            task={task}
            projects={projects || []}
            categories={categories || []}
            onSuccess={handleTaskUpdated}
          />
        ) : (
          <div className="space-y-6">

            {/* ================================== */}
            {/* TITLE */}
            {/* ================================== */}

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-2xl font-bold">
                  {task.title || "Untitled Task"}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    variant={status.variant}
                    className="gap-1"
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {status.label}
                  </Badge>

                  <Badge
                    variant={
                      priorityVariant[
                        task.priority
                      ] || "secondary"
                    }
                    className="capitalize"
                  >
                    {task.priority || "medium"}{" "}
                    Priority
                  </Badge>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setEditing(true)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />

                Edit
              </Button>
            </div>

            {/* ================================== */}
            {/* DESCRIPTION */}
            {/* ================================== */}

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-2 font-semibold">
                  Description
                </h3>

                {task.description ? (
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    No description provided.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ================================== */}
            {/* PROJECT */}
            {/* ================================== */}

            {projectName && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Project
                  </p>

                  <p className="font-medium">
                    {projectName}
                  </p>
                </div>
              </div>
            )}

            {/* ================================== */}
            {/* CATEGORY */}
            {/* ================================== */}

            {categoryName && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Tag className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Category
                  </p>

                  <p className="font-medium">
                    {categoryName}
                  </p>
                </div>
              </div>
            )}

            {/* ================================== */}
            {/* DUE DATE */}
            {/* ================================== */}

            {task.dueDate && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Due Date
                  </p>

                  <p className="font-medium">
                    {new Date(
                      task.dueDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* ================================== */}
            {/* META */}
            {/* ================================== */}

            <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">

              <div>
                <p className="text-xs text-muted-foreground">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium">
                  {task.createdAt
                    ? new Date(
                        task.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Unknown"}
                </p>
              </div>

              {task.completedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Completed
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {new Date(
                      task.completedAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}