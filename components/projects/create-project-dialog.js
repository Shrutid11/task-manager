"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateProjectDialog({
  onProjectCreated,
}) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/projects", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      console.log("Project API response:", data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to create project"
        );
      }

      if (onProjectCreated) {
        await onProjectCreated();
      }

      setName("");
      setDescription("");

      setOpen(false);
    } catch (error) {
      console.error(
        "Error creating project:",
        error
      );

      alert(
        error.message ||
          "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {/* SHADCN-STYLED DIALOG TRIGGER */}
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: "default",
            size: "default",
          })
        )}
      >
        <Plus className="h-4 w-4" />
        Create Project
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name
            </Label>

            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Input
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}