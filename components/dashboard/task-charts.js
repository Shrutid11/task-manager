"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TaskCharts({ tasks = [] }) {
  // ================= STATUS DATA =================

  const statusData = [
    {
      name: "To Do",
      value: tasks.filter(
        (task) => task.status === "todo"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (task) => task.status === "in-progress"
      ).length,
    },
    {
      name: "Completed",
      value: tasks.filter(
        (task) => task.status === "completed"
      ).length,
    },
  ].filter((item) => item.value > 0);

  // ================= PRIORITY DATA =================

  const priorityData = [
    {
      name: "High",
      value: tasks.filter(
        (task) => task.priority === "high"
      ).length,
    },
    {
      name: "Medium",
      value: tasks.filter(
        (task) => task.priority === "medium"
      ).length,
    },
    {
      name: "Low",
      value: tasks.filter(
        (task) => task.priority === "low"
      ).length,
    },
  ];

  const hasTasks = tasks.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ================= TASKS BY STATUS ================= */}

      <Card>
        <CardHeader>
          <CardTitle>
            Tasks by Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!hasTasks ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No task data available.
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ================= TASKS BY PRIORITY ================= */}

      <Card>
        <CardHeader>
          <CardTitle>
            Tasks by Priority
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!hasTasks ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No task data available.
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={priorityData}
                margin={{
                  top: 20,
                  right: 20,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}