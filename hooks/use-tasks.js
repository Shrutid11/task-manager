"use client";

import { useCallback, useEffect, useState } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/tasks");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      setTasks(data.tasks);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create task");
    }

    setTasks((currentTasks) => [data.task, ...currentTasks]);

    return data.task;
  };

  const updateTask = async (id, taskData) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === id ? data.task : task
      )
    );

    return data.task;
  };

  const deleteTask = async (id) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== id)
    );
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}