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
  // ==========================================
  // DATA
  // ==========================================

  const { tasks = [], fetchTasks } = useTasks();

  const {
    projects = [],
    fetchProjects,
  } = useProjects();

  const {
    categories = [],
    fetchCategories,
  } = useCategories();

  // ==========================================
  // NAVIGATION STATE
  // ==========================================

  const [activePage, setActivePage] =
    useState("dashboard");

  // Desktop sidebar
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  // Mobile sidebar
  const [mobileOpen, setMobileOpen] =
    useState(false);

  // ==========================================
  // TASK FILTER STATES
  // ==========================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [priority, setPriority] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  // ==========================================
  // RESPONSIVE SIDEBAR TOGGLE
  // ==========================================

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  // ==========================================
  // FILTER + SORT TASKS
  // ==========================================

  const filteredTasks = [...tasks]
    .filter((task) => {
      const matchesSearch = (
        task.title || ""
      )
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        task.status === status;

      const matchesPriority =
        priority === "all" ||
        task.priority === priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
          );

        case "oldest":
          return (
            new Date(a.createdAt || 0) -
            new Date(b.createdAt || 0)
          );

        case "dueDate": {
          const dateA = a.dueDate
            ? new Date(a.dueDate)
            : new Date("9999-12-31");

          const dateB = b.dueDate
            ? new Date(b.dueDate)
            : new Date("9999-12-31");

          return dateA - dateB;
        }

        case "priority": {
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

        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ================= NAVBAR ================= */}

      <Navbar
        sidebarOpen={sidebarOpen}
        onMenuClick={handleMenuClick}
        search={search}
        setSearch={setSearch}
        onSearchFocus={() =>
          setActivePage("tasks")
        }
      />

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ================= MAIN CONTENT ================= */}

      <main
        className={`
          min-h-[calc(100vh-4rem)]
          overflow-x-hidden
          p-4
          transition-all
          duration-300
          ease-in-out
          md:p-6
          ${
            sidebarOpen
              ? "md:ml-64"
              : "md:ml-0"
          }
        `}
      >
        {/* ====================================== */}
        {/* DASHBOARD */}
        {/* ====================================== */}

        {activePage === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Dashboard
                </h1>

                <p className="mt-1 text-muted-foreground">
                  Here's an overview of your tasks and projects.
                </p>
              </div>

              <CreateTaskDialog
                projects={projects}
                categories={categories}
                onTaskCreated={fetchTasks}
              />
            </div>

            <StatsCards
              tasks={tasks}
              projects={projects}
              categories={categories}
            />

            <TaskAnalytics
              tasks={tasks}
            />

            <TaskCharts
              tasks={tasks}
            />

            <TaskCompletionTrend
              tasks={tasks}
            />

            <ProjectCategoryCharts
              tasks={tasks}
              projects={projects}
              categories={categories}
            />

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

        {/* ====================================== */}
        {/* TASKS */}
        {/* ====================================== */}

        {activePage === "tasks" && (
          <div className="space-y-6">
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

            <TaskFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              priority={priority}
              setPriority={setPriority}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <TaskList
              tasks={filteredTasks}
              projects={projects}
              categories={categories}
              onTaskUpdated={fetchTasks}
            />
          </div>
        )}

        {/* ====================================== */}
        {/* PROJECTS */}
        {/* ====================================== */}

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

        {/* ====================================== */}
        {/* CATEGORIES */}
        {/* ====================================== */}

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
  );
}