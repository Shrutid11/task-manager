"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import TaskForm from "./task-form";

export default function CreateTaskDialog({
  projects = [],
  categories = [],
  onTaskCreated,
}) {
  const [open, setOpen] = useState(false);

  // ==========================================
  // TASK CREATED SUCCESSFULLY
  // ==========================================

  const handleSuccess = async (task) => {
    try {
      if (onTaskCreated) {
        await onTaskCreated(task);
      }

      setOpen(false);
    } catch (error) {
      console.error(
        "Error refreshing tasks:",
        error
      );
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Task
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Create New Task
            </DialogTitle>
          </DialogHeader>

          <TaskForm
            projects={projects}
            categories={categories}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}