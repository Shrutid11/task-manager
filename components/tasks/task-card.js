"use client";

import { useState } from "react";

import {
  Eye,
  Trash2,
  FolderKanban,
  Tag,
  CalendarDays,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TaskDetails from "./task-details";
import DeleteTaskDialog from "./delete-task-dialog";

export default function TaskCard({
  task,
  projects = [],
  categories = [],
  onTaskUpdated,
}) {
  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // ==========================================
  // PRIORITY VARIANTS
  // ==========================================

  const priorityVariant = {
    low: "secondary",
    medium: "default",
    high: "destructive",
  };

  // ==========================================
  // STATUS LABELS
  // ==========================================

  const statusLabel = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // ==========================================
  // GET ID SAFELY
  // ==========================================

  const getId = (value) => {
    if (!value) return null;

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
    if (!task.project) {
      return null;
    }

    // If project is populated
    if (
      typeof task.project === "object"
    ) {
      return (
        task.project?.name ||
        null
      );
    }

    const project = projects.find(
      (item) =>
        getId(item) ===
        getId(task.project)
    );

    return (
      project?.name ||
      null
    );
  };

  // ==========================================
  // CATEGORY NAME
  // ==========================================

  const getCategoryName = () => {
    if (!task.category) {
      return null;
    }

    // If category is populated
    if (
      typeof task.category === "object"
    ) {
      return (
        task.category?.name ||
        null
      );
    }

    const category = categories.find(
      (item) =>
        getId(item) ===
        getId(task.category)
    );

    return (
      category?.name ||
      null
    );
  };

  // ==========================================
  // DUE DATE STATUS
  // ==========================================

  const getDueDateStatus = () => {
    if (!task.dueDate) {
      return null;
    }

    // Completed tasks don't need overdue warning
    if (
      task.status === "completed"
    ) {
      return null;
    }

    const today = new Date();

    const dueDate =
      new Date(task.dueDate);

    today.setHours(
      0,
      0,
      0,
      0
    );

    dueDate.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      dueDate.getTime() -
      today.getTime();

    const daysLeft =
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      );

    if (daysLeft < 0) {
      return {
        label: "Overdue",
        variant: "destructive",
      };
    }

    if (daysLeft === 0) {
      return {
        label: "Due Today",
        variant: "default",
      };
    }

    if (daysLeft === 1) {
      return {
        label: "Due Tomorrow",
        variant: "secondary",
      };
    }

    return {
      label: `${daysLeft} days left`,
      variant: "outline",
    };
  };

  // ==========================================
  // QUICK STATUS UPDATE
  // ==========================================

  const handleStatusChange =
    async (newStatus) => {
      if (
        newStatus === task.status
      ) {
        return;
      }

      try {
        setUpdatingStatus(true);

        const response =
          await fetch(
            `/api/tasks/${task._id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status: newStatus,
              }),
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          );

        const data =
          contentType?.includes(
            "application/json"
          )
            ? await response.json()
            : {};

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to update task status"
          );
        }

        if (onTaskUpdated) {
          await onTaskUpdated();
        }
      } catch (error) {
        console.error(
          "Error updating task status:",
          error
        );

        alert(
          error.message ||
            "Failed to update task status"
        );
      } finally {
        setUpdatingStatus(false);
      }
    };

  // ==========================================
  // VALUES
  // ==========================================

  const projectName =
    getProjectName();

  const categoryName =
    getCategoryName();

  const dueDateStatus =
    getDueDateStatus();

  const formattedDueDate =
    task.dueDate
      ? new Date(
          task.dueDate
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : null;

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Card className="flex min-h-[290px] flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

        {/* HEADER */}

        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">

          <div className="min-w-0 flex-1">

            <CardTitle className="line-clamp-2 break-words text-lg leading-6">
              {task.title}
            </CardTitle>

            {/* STATUS + PRIORITY */}

            <div className="mt-3 flex flex-wrap items-center gap-2">

              <Select
                value={
                  task.status ||
                  "todo"
                }
                onValueChange={
                  handleStatusChange
                }
                disabled={
                  updatingStatus
                }
              >
                <SelectTrigger className="h-8 w-[145px] text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="todo">
                    To Do
                  </SelectItem>

                  <SelectItem value="in-progress">
                    In Progress
                  </SelectItem>

                  <SelectItem value="completed">
                    Completed
                  </SelectItem>

                </SelectContent>
              </Select>

              <Badge
                variant={
                  priorityVariant[
                    task.priority
                  ] ||
                  "secondary"
                }
                className="capitalize"
              >
                {task.priority ||
                  "medium"}
              </Badge>

              {updatingStatus && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex shrink-0 items-center gap-1">

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                setDetailsOpen(true)
              }
              title="View task"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() =>
                setDeleteOpen(true)
              }
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

          </div>

        </CardHeader>

        {/* CONTENT */}

        <CardContent className="flex flex-1 flex-col">

          {/* DESCRIPTION */}

          {task.description ? (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No description provided.
            </p>
          )}

          {/* TASK DETAILS */}

          <div className="mt-auto space-y-3 pt-6">

            {/* PROJECT */}

            {projectName && (
              <div className="flex min-w-0 items-center gap-2 text-sm">

                <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />

                <span className="truncate text-muted-foreground">
                  {projectName}
                </span>

              </div>
            )}

            {/* CATEGORY */}

            {categoryName && (
              <div className="flex min-w-0 items-center gap-2 text-sm">

                <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />

                <span className="truncate text-muted-foreground">
                  {categoryName}
                </span>

              </div>
            )}

            {/* DUE DATE */}

            {formattedDueDate && (
              <div className="flex flex-wrap items-center gap-2 text-sm">

                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

                <span className="text-muted-foreground">
                  {formattedDueDate}
                </span>

                {dueDateStatus && (
                  <Badge
                    variant={
                      dueDateStatus.variant
                    }
                    className="text-xs"
                  >
                    {dueDateStatus.label}
                  </Badge>
                )}

              </div>
            )}

          </div>

        </CardContent>

      </Card>

      {/* ========================================== */}
      {/* TASK DETAILS */}
      {/* ========================================== */}

      <TaskDetails
        task={task}
        projects={projects}
        categories={categories}
        open={detailsOpen}
        onOpenChange={
          setDetailsOpen
        }
        onTaskUpdated={
          onTaskUpdated
        }
      />

      {/* ========================================== */}
      {/* DELETE TASK */}
      {/* ========================================== */}

      <DeleteTaskDialog
        task={task}
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        onTaskDeleted={
          onTaskUpdated
        }
      />
    </>
  );
}