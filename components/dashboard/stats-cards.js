"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  Tags,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({
  tasks = [],
  projects = [],
  categories = [],
}) {
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Circle,
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: Circle,
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock3,
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
    },
    {
      title: "Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      title: "Categories",
      value: categories.length,
      icon: Tags,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stat.value}
                </p>
              </div>

              <Icon className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}