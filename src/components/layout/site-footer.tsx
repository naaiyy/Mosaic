"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div
        className={cn(
          "flex items-center justify-center py-6 md:h-16",
          "px-4 sm:px-6 mx-auto w-full max-w-7xl",
        )}
      >
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mosaic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
