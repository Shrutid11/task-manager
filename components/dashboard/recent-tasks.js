"use client";

import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecentTasks({ tasks = [] }) {
  const recentTasks = tasks.slice(0, 5);

  const getStatusVariant = (status) => {
    if (status === "completed") return "default";
    if (status === "in-progress") return "secondary";

    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>

      <CardContent>
        {recentTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tasks yet. Create your first task!
          </p>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium">
                    {task.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusVariant(task.status)}>
                      {task.status}
                    </Badge>

                    <Badge variant="outline">
                      {task.priority} priority
                    </Badge>

                    {task.project && (
                      <Badge variant="secondary">
                        {task.project.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {task.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />

                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}