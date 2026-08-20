"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);

      document.documentElement.classList.toggle(
        "dark",
        savedTheme === "dark"
      );
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const initialTheme = systemDark ? "dark" : "light";

      setTheme(initialTheme);

      document.documentElement.classList.toggle(
        "dark",
        systemDark
      );
    }
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );

    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}