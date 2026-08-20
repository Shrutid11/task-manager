"use client";

import {
  Bell,
  Menu,
  PanelLeftClose,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ThemeToggle from "@/components/theme-toggle";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export default function Navbar({
  onMenuClick,
  sidebarOpen,
  search = "",
  setSearch,
  onSearchFocus,
}) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            T
          </div>

          <span className="hidden text-lg font-bold sm:inline-block">
            TaskFlow
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="hidden w-full max-w-md px-6 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={search ?? ""}
            onChange={(e) =>
              setSearch?.(e.target.value)
            }
            onFocus={onSearchFocus}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <ThemeToggle />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarFallback>
            SD
          </AvatarFallback>
        </Avatar>

      </div>
    </header>
  );
}