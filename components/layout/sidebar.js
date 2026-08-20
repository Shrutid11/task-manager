"use client";

import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Tags,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    name: "Dashboard",
    value: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    value: "tasks",
    icon: ListTodo,
  },
  {
    name: "Projects",
    value: "projects",
    icon: FolderKanban,
  },
  {
    name: "Categories",
    value: "categories",
    icon: Tags,
  },
];

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  setMobileOpen,
}) {
  const handleNavigation = (page) => {
    setActivePage(page);

    // Close sidebar on mobile after selecting a page
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed left-0 top-16 z-50
          flex h-[calc(100vh-4rem)] w-64
          flex-col border-r bg-background
          shadow-sm
          transition-transform duration-300 ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          ${
            sidebarOpen
              ? "md:translate-x-0"
              : "md:-translate-x-full"
          }

          md:z-30
        `}
      >
        {/* ================= MOBILE HEADER ================= */}

        <div className="flex h-14 items-center justify-between px-4 md:hidden">
          <span className="text-lg font-bold">
            TaskFlow
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Separator className="md:hidden" />

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.value}
                type="button"
                variant={
                  activePage === item.value
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start gap-3"
                onClick={() =>
                  handleNavigation(item.value)
                }
              >
                <Icon className="h-5 w-5" />

                {item.name}
              </Button>
            );
          })}
        </nav>

        {/* ================= FOOTER ================= */}

        <div className="p-4">
          <Separator className="mb-4" />

          <p className="text-xs text-muted-foreground">
            TaskFlow © 2026
          </p>
        </div>
      </aside>
    </>
  );
}