"use client";

import { useState } from "react";

// Layout
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";

// Dashboard
import StatsCards from "@/components/dashboard/stats-cards";
import TaskProgress from "@/components/dashboard/task-progress";
import RecentTasks from "@/components/dashboard/recent-tasks";
import TaskAnalytics from "@/components/dashboard/task-analytics";
import TaskCharts from "@/components/dashboard/task-charts";
import ProjectCategoryCharts from "@/components/dashboard/project-category-charts";
import TaskCompletionTrend from "@/components/dashboard/task-completion-trend";

// Tasks
import CreateTaskDialog from "@/components/tasks/create-task-dialog";
import TaskList from "@/components/tasks/task-list";
import TaskFilters from "@/components/tasks/task-filters";

// Projects
import CreateProjectDialog from "@/components/projects/create-project-dialog";
import ProjectList from "@/components/projects/project-list";

// Categories
import CategoryForm from "@/components/categories/category-form";
import CategoryList from "@/components/categories/category-list";

// Hooks
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { useCategories } from "@/hooks/use-categories";

export default function Home() {
  const { tasks, fetchTasks } = useTasks();
  const { projects, fetchProjects } = useProjects();
  const { categories, fetchCategories } = useCategories();

  // ================= PAGE STATES =================

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ================= TASK FILTER STATES =================

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ================= FILTER + SORT TASKS =================

  const filteredTasks = [...tasks]
    .filter((task) => {
      // Search filter
      const matchesSearch = (task.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        status === "all" || task.status === status;

      // Priority filter
      const matchesPriority =
        priority === "all" || task.priority === priority;

      // Due date filter
      let matchesDueDate = true;

      if (dueDateFilter !== "all") {
        // Tasks with no due date
        if (dueDateFilter === "no-date") {
          matchesDueDate = !task.dueDate;
        } else if (task.dueDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          const difference = Math.ceil(
            (dueDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (dueDateFilter === "overdue") {
            matchesDueDate = difference < 0;
          } else if (dueDateFilter === "today") {
            matchesDueDate = difference === 0;
          } else if (dueDateFilter === "tomorrow") {
            matchesDueDate = difference === 1;
          } else if (dueDateFilter === "week") {
            matchesDueDate =
              difference >= 0 && difference <= 7;
          }
        } else {
          matchesDueDate = false;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDueDate
      );
    })
    .sort((a, b) => {
      // Newest first
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      // Oldest first
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      // Sort by due date
      if (sortBy === "dueDate") {
        const dateA = a.dueDate
          ? new Date(a.dueDate)
          : new Date("9999-12-31");

        const dateB = b.dueDate
          ? new Date(b.dueDate)
          : new Date("9999-12-31");

        return dateA - dateB;
      }

      // Sort by priority
      if (sortBy === "priority") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          (priorityOrder[a.priority] || 4) -
          (priorityOrder[b.priority] || 4)
        );
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-muted/30">

      {/* ================= NAVBAR ================= */}

      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        search={search}
        setSearch={setSearch}
        onSearchFocus={() => {
          setActivePage("tasks");
        }}
      />

      <div className="flex">

        {/* ================= SIDEBAR ================= */}

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* ================= MAIN CONTENT ================= */}

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">

          {/* ============================================ */}
          {/* DASHBOARD */}
          {/* ============================================ */}

          {activePage === "dashboard" && (
            <div className="space-y-6">

              {/* Dashboard Header */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h1 className="text-3xl font-bold">
                    Dashboard
                  </h1>

                  <p className="text-muted-foreground">
                    Here's an overview of your tasks and projects.
                  </p>
                </div>

                <CreateTaskDialog
                  projects={projects}
                  categories={categories}
                  onTaskCreated={fetchTasks}
                />

              </div>

              {/* Statistics Cards */}

              <StatsCards
                tasks={tasks}
                projects={projects}
                categories={categories}
              />

              {/* Task Analytics */}

              <TaskAnalytics
                tasks={tasks}
              />

              {/* Status + Priority Charts */}

              <TaskCharts
                tasks={tasks}
              />

              {/* Task Completion Trend */}

              <TaskCompletionTrend
                tasks={tasks}
              />

              {/* Project + Category Charts */}

              <ProjectCategoryCharts
                tasks={tasks}
                projects={projects}
                categories={categories}
              />

              {/* Task Progress + Recent Tasks */}

              <div className="grid gap-6 xl:grid-cols-2">

                <TaskProgress
                  tasks={tasks}
                />

                <RecentTasks
                  tasks={tasks}
                />

              </div>

            </div>
          )}

          {/* ============================================ */}
          {/* TASKS */}
          {/* ============================================ */}

          {activePage === "tasks" && (
            <div className="space-y-6">

              {/* Tasks Header */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h1 className="text-3xl font-bold">
                    Tasks
                  </h1>

                  <p className="mt-2 text-muted-foreground">
                    Manage and organize all your tasks.
                  </p>
                </div>

                <CreateTaskDialog
                  projects={projects}
                  categories={categories}
                  onTaskCreated={fetchTasks}
                />

              </div>

              {/* Task Filters */}

              <TaskFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                dueDateFilter={dueDateFilter}
                setDueDateFilter={setDueDateFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Filtered Task List */}

              <TaskList
                tasks={filteredTasks}
                projects={projects}
                categories={categories}
                onTaskUpdated={fetchTasks}
              />

            </div>
          )}

          {/* ============================================ */}
          {/* PROJECTS */}
          {/* ============================================ */}

          {activePage === "projects" && (
            <div className="space-y-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h1 className="text-3xl font-bold">
                    Projects
                  </h1>

                  <p className="mt-2 text-muted-foreground">
                    Create and manage all your projects.
                  </p>
                </div>

                <CreateProjectDialog
                  onProjectCreated={fetchProjects}
                />

              </div>

              <ProjectList
                projects={projects}
                onProjectUpdated={fetchProjects}
              />

            </div>
          )}

          {/* ============================================ */}
          {/* CATEGORIES */}
          {/* ============================================ */}

          {activePage === "categories" && (
            <div className="space-y-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h1 className="text-3xl font-bold">
                    Categories
                  </h1>

                  <p className="mt-2 text-muted-foreground">
                    Create and manage your task categories.
                  </p>
                </div>

                <CategoryForm
                  onCategoryCreated={fetchCategories}
                />

              </div>

              <CategoryList
                categories={categories}
                onCategoryDeleted={fetchCategories}
              />

            </div>
          )}

        </main>

      </div>

    </div>
  );
}