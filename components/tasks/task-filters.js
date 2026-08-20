"use client";

import { Search, ArrowUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskFilters({
  search = "",
  setSearch,
  status = "all",
  setStatus,
  priority = "all",
  setPriority,
  sortBy = "newest",
  setSortBy,
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Search tasks..."
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full pl-9"
          />
        </div>

        {/* Filters */}
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:w-auto">
          
          {/* Status */}
          <Select
            value={status ?? "all"}
            onValueChange={setStatus}
          >
            <SelectTrigger className="h-10 w-full lg:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="todo">
                To Do
              </SelectItem>

              <SelectItem value="in-progress">
                In Progress
              </SelectItem>

              <SelectItem value="completed">
                Completed
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Priority */}
          <Select
            value={priority ?? "all"}
            onValueChange={setPriority}
          >
            <SelectTrigger className="h-10 w-full lg:w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Priorities
              </SelectItem>

              <SelectItem value="high">
                High
              </SelectItem>

              <SelectItem value="medium">
                Medium
              </SelectItem>

              <SelectItem value="low">
                Low
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <div className="relative col-span-2 sm:col-span-1">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Select
              value={sortBy ?? "newest"}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="h-10 w-full pl-9 lg:w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">
                  Newest First
                </SelectItem>

                <SelectItem value="oldest">
                  Oldest First
                </SelectItem>

                <SelectItem value="dueDate">
                  Due Date
                </SelectItem>

                <SelectItem value="priority">
                  Priority
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>
    </div>
  );
}