"use client";

import ProjectCard from "./project-card";

export default function ProjectList({
  projects = [],
  onProjectUpdated,
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-semibold">
          No projects found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onProjectUpdated={onProjectUpdated}
        />
      ))}
    </div>
  );
}