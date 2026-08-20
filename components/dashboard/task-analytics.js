"use client";

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarDays,
  ListTodo,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TaskAnalytics({ tasks = [] }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate < today &&
      task.status !== "completed"
    );
  }).length;

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate.getTime() === today.getTime() &&
      task.status !== "completed"
    );
  }).length;

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate > today &&
      task.status !== "completed"
    );
  }).length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3">
              <ListTodo className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Tasks
              </p>

              <p className="text-2xl font-bold">
                {totalTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <p className="text-2xl font-bold">
                {completedTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                In Progress
              </p>

              <p className="text-2xl font-bold">
                {inProgressTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Completion Rate
              </p>

              <p className="text-2xl font-bold">
                {completionRate}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadline Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {overdueTasks}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tasks past their due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5" />
              Due Today
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {dueTodayTasks}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tasks requiring attention today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {upcomingTasks}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tasks scheduled for the future
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Summary</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              To Do
            </p>

            <p className="mt-1 text-2xl font-bold">
              {todoTasks}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              In Progress
            </p>

            <p className="mt-1 text-2xl font-bold">
              {inProgressTasks}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Completed
            </p>

            <p className="mt-1 text-2xl font-bold">
              {completedTasks}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}