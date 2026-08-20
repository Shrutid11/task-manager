"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectCategoryCharts({
  tasks = [],
  projects = [],
  categories = [],
}) {
  // ==============================
  // TASKS BY PROJECT
  // ==============================

  const projectData = projects.map((project) => {
    const projectId = project._id || project.id;

    const count = tasks.filter((task) => {
      const taskProject =
        task.project?._id ||
        task.project?.id ||
        task.project;

      return String(taskProject) === String(projectId);
    }).length;

    return {
      name: project.name || project.title || "Unnamed",
      tasks: count,
    };
  });

  // ==============================
  // TASKS BY CATEGORY
  // ==============================

  const categoryData = categories.map((category) => {
    const categoryId = category._id || category.id;

    const count = tasks.filter((task) => {
      const taskCategory =
        task.category?._id ||
        task.category?.id ||
        task.category;

      return String(taskCategory) === String(categoryId);
    }).length;

    return {
      name: category.name || category.title || "Unnamed",
      tasks: count,
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ================= PROJECT CHART ================= */}

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Tasks by Project</CardTitle>
        </CardHeader>

        <CardContent>
          {projectData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -10,
                    bottom: 10,
                  }}
                  barCategoryGap="40%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="tasks"
                    radius={[6, 6, 0, 0]}
                    barSize={60}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No project data available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= CATEGORY CHART ================= */}

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Tasks by Category</CardTitle>
        </CardHeader>

        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -10,
                    bottom: 10,
                  }}
                  barCategoryGap="40%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="tasks"
                    radius={[6, 6, 0, 0]}
                    barSize={60}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No category data available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}