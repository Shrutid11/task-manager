"use client";

import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

export default function TaskProgress({ tasks = [] }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Task Progress
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">
              {progress}%
            </p>

            <p className="text-sm text-muted-foreground">
              Overall completion
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {completedTasks} of {totalTasks} completed
          </p>
        </div>

        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}