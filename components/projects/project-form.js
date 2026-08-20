"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectForm({
  project,
  onSuccess,
}) {
  const [name, setName] = useState(
    project?.name || ""
  );

  const [description, setDescription] = useState(
    project?.description || ""
  );

  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(project?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `/api/projects/${project._id}`
        : "/api/projects";

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update project"
            : "Failed to create project"
        );
      }

      const data = await response.json();

      if (!isEditing) {
        setName("");
        setDescription("");
      }

      if (onSuccess) {
        await onSuccess(
          data.project || data
        );
      }
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      alert(
        isEditing
          ? "Failed to update project"
          : "Failed to create project"
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
      <div className="space-y-2">
        <Label htmlFor="project-name">
          Project Name
        </Label>

        <Input
          id="project-name"
          placeholder="Enter project name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">
          Description
        </Label>

        <Textarea
          id="project-description"
          placeholder="Describe your project"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}