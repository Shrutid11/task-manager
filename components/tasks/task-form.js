"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskForm({
  task = null,
  projects = [],
  categories = [],
  onSuccess,
}) {
  // ==========================================
  // SAFE ID
  // ==========================================

  const getId = (value) => {
    if (!value) return "none";

    if (typeof value === "object") {
      return String(value._id || value.id || "none");
    }

    return String(value);
  };

  // ==========================================
  // SAFE DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date)
        .toISOString()
        .split("T")[0];
    } catch {
      return "";
    }
  };

  // ==========================================
  // STATE
  // ==========================================

  const [title, setTitle] = useState(
    task?.title ?? ""
  );

  const [description, setDescription] = useState(
    task?.description ?? ""
  );

  const [status, setStatus] = useState(
    task?.status || "todo"
  );

  const [priority, setPriority] = useState(
    task?.priority || "medium"
  );

  const [project, setProject] = useState(
    getId(task?.project)
  );

  const [category, setCategory] = useState(
    getId(task?.category)
  );

  const [dueDate, setDueDate] = useState(
    formatDate(task?.dueDate)
  );

  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(task?._id);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: title.trim(),
        description: description.trim(),

        status,

        priority,

        // Convert "none" to null
        project:
          project === "none"
            ? null
            : project,

        category:
          category === "none"
            ? null
            : category,

        dueDate: dueDate || null,
      };

      const url = isEditing
        ? `/api/tasks/${task._id}`
        : "/api/tasks";

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(taskData),
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
            data.message ||
            (isEditing
              ? "Failed to update task"
              : "Failed to create task")
        );
      }

      // ======================================
      // SUCCESS TOAST
      // ======================================

      toast.success(
        isEditing
          ? "Task updated successfully"
          : "Task created successfully"
      );

      // ======================================
      // REFRESH TASK LIST
      // ======================================

      if (onSuccess) {
        await onSuccess(data.task || data);
      }

      // ======================================
      // RESET ONLY CREATE FORM
      // ======================================

      if (!isEditing) {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setProject("none");
        setCategory("none");
        setDueDate("");
      }
    } catch (error) {
      console.error(
        isEditing
          ? "Error updating task:"
          : "Error creating task:",
        error
      );

      // ======================================
      // ERROR TOAST
      // ======================================

      toast.error(
        error.message ||
          (isEditing
            ? "Failed to update task"
            : "Failed to create task")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ================= TITLE ================= */}

      <div className="space-y-2">
        <Label htmlFor="title">
          Task Title
        </Label>

        <Input
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
      </div>

      {/* ================= DESCRIPTION ================= */}

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      {/* ================= STATUS + PRIORITY ================= */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
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
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>

          <Select
            value={priority}
            onValueChange={setPriority}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="low">
                Low
              </SelectItem>

              <SelectItem value="medium">
                Medium
              </SelectItem>

              <SelectItem value="high">
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ================= PROJECT ================= */}

      <div className="space-y-2">
        <Label>Project</Label>

        <Select
          value={project}
          onValueChange={setProject}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project (optional)" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">
              No Project
            </SelectItem>

            {projects.map((item) => (
              <SelectItem
                key={String(item._id)}
                value={String(item._id)}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ================= CATEGORY ================= */}

      <div className="space-y-2">
        <Label>Category</Label>

        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category (optional)" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">
              No Category
            </SelectItem>

            {categories.map((item) => (
              <SelectItem
                key={String(item._id)}
                value={String(item._id)}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ================= DUE DATE ================= */}

      <div className="space-y-2">
        <Label htmlFor="dueDate">
          Due Date
        </Label>

        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />
      </div>

      {/* ================= BUTTON ================= */}

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Task"
              : "Create Task"}
        </Button>
      </div>
    </form>
  );
}