"use client";

import TaskCard from "./task-card";

export default function TaskList({
  tasks = [],
  projects = [],
  categories = [],
  onTaskUpdated,
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-card p-10 text-center">
        <h3 className="text-lg font-semibold">
          No tasks found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          No tasks match your current search or filters. Try changing
          your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          projects={projects}
          categories={categories}
          onTaskUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
}