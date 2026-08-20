"use client";

import { useCallback, useEffect, useState } from "react";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/projects");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create project");
    }

    setProjects((currentProjects) => [
      data.project,
      ...currentProjects,
    ]);

    return data.project;
  };

  const updateProject = async (id, projectData) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update project");
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project._id === id ? data.project : project
      )
    );

    return data.project;
  };

  const deleteProject = async (id) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete project");
    }

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project._id !== id)
    );
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}