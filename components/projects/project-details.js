"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ProjectForm from "./project-form";

export default function ProjectDetails({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}) {
  const [editing, setEditing] = useState(false);

  if (!project) return null;

  const handleSuccess = async () => {
    setEditing(false);

    if (onProjectUpdated) {
      await onProjectUpdated();
    }

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setEditing(false);
        onOpenChange(value);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        {!editing ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <DialogTitle>
                  Project Details
                </DialogTitle>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Project Name
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {project.name}
                </h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Description
                </p>

                <p className="mt-1">
                  {project.description ||
                    "No description provided."}
                </p>
              </div>

              {project.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created
                  </p>

                  <p className="mt-1">
                    {new Date(
                      project.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Edit Project
              </DialogTitle>
            </DialogHeader>

            <ProjectForm
              project={project}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}