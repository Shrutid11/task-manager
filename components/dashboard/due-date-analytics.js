"use client";

import {
  AlertTriangle,
  CalendarDays,
  CalendarClock,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DueDateAnalytics({ tasks = [] }) {
  const getDateWithoutTime = (date) => {
    const newDate = new Date(date);

    newDate.setHours(0, 0, 0, 0);

    return newDate;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = getDateWithoutTime(task.dueDate);

    return (
      dueDate < today &&
      task.status !== "completed"
    );
  });

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = getDateWithoutTime(task.dueDate);

    return (
      dueDate.getTime() === today.getTime() &&
      task.status !== "completed"
    );
  });

  const dueTomorrowTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = getDateWithoutTime(task.dueDate);

    return (
      dueDate.getTime() === tomorrow.getTime() &&
      task.status !== "completed"
    );
  });

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = getDateWithoutTime(task.dueDate);

    return (
      dueDate > tomorrow &&
      task.status !== "completed"
    );
  });

  const analytics = [
    {
      title: "Overdue Tasks",
      value: overdueTasks.length,
      description: "Tasks past their due date",
      icon: AlertTriangle,
    },
    {
      title: "Due Today",
      value: dueTodayTasks.length,
      description: "Tasks requiring attention today",
      icon: CalendarDays,
    },
    {
      title: "Due Tomorrow",
      value: dueTomorrowTasks.length,
      description: "Tasks scheduled for tomorrow",
      icon: Clock3,
    },
    {
      title: "Upcoming Tasks",
      value: upcomingTasks.length,
      description: "Tasks scheduled for the future",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {analytics.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {item.value}
              </div>

              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}