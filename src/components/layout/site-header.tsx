"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { MainNav } from "../navigation/main-nav";
import { ModeToggle } from "../ui/mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div
        className={cn(
          "flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0",
          "px-4 sm:px-6 mx-auto w-full max-w-7xl",
        )}
      >
        <div className="flex gap-6 md:gap-10">
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
