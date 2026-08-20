"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TaskCompletionTrend({ tasks = [] }) {
  // Get completed tasks
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  // Group completed tasks by date
  const completionMap = {};

  completedTasks.forEach((task) => {
    const date = new Date(
      task.updatedAt || task.createdAt
    );

    const formattedDate = date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );

    if (completionMap[formattedDate]) {
      completionMap[formattedDate] += 1;
    } else {
      completionMap[formattedDate] = 1;
    }
  });

  // Convert object into chart data
  const chartData = Object.entries(completionMap).map(
    ([date, completed]) => ({
      date,
      completed,
    })
  );

  // Sort by actual date
  const sortedChartData = chartData.sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Task Completion Trend
        </CardTitle>
      </CardHeader>

      <CardContent>
        {sortedChartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No completed tasks yet.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={sortedChartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="currentColor"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}