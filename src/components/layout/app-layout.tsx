import { cn } from "@/lib/utils";
// Server Component by default (no 'use client' directive)
import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

// Import SSR version of icons for server components
import {
  House as HouseIcon,
  Warning as WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

// Define types for layout props
interface AppLayoutProps {
  children: React.ReactNode;
  containerClassName?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  mainClassName?: string;
  fullWidth?: boolean;
}

/**
 * AppLayout - Core layout component for the application
 *
 * This component serves as the source of truth for layout and responsiveness.
 * It provides consistent spacing, responsive behavior, and optional props
 * to customize the layout for different views.
 */
export function AppLayout({
  children,
  containerClassName,
  hideHeader = false,
  hideFooter = false,
  mainClassName,
  fullWidth = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <SiteHeader />}

      <main
        className={cn(
          "flex-1 flex flex-col",
          "py-6 md:py-8 lg:py-10",
          mainClassName,
        )}
      >
        <div
          className={cn(
            // Base container with responsive padding
            "px-4 sm:px-6 mx-auto w-full",
            // Responsive max-width constraints unless fullWidth is true
            fullWidth ? "max-w-none" : "max-w-7xl",
            containerClassName,
          )}
        >
          {children}
        </div>
      </main>

      {!hideFooter && <SiteFooter />}
    </div>
  );
}

/**
 * ContentSection - Reusable content section with consistent spacing
 * for building complex page layouts
 */
export function ContentSection({
  children,
  className,
  title,
  description,
  titleClassName,
  descriptionClassName,
  withAlert,
  alertMessage,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  withAlert?: boolean;
  alertMessage?: string;
}) {
  return (
    <section
      className={cn(
        "w-full",
        // Removed default vertical padding to avoid stacking with AppLayout's padding
        className,
      )}
    >
      {withAlert && (
        <div className="mb-6 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <WarningIcon className="h-5 w-5" />
            <p className="text-sm">
              {alertMessage || "Please note this important information."}
            </p>
          </div>
        </div>
      )}

      {title && (
        <div className="mb-6 space-y-2">
          <h2
            className={cn("text-2xl font-bold tracking-tight", titleClassName)}
          >
            {title}
          </h2>

          {description && (
            <p className={cn("text-muted-foreground", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}

/**
 * PageHeader - Consistent page header component
 */
export function PageHeader({
  title,
  description,
  children,
  backLink,
  backLinkLabel = "Back",
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  backLink?: string;
  backLinkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pb-6 md:pb-8 lg:pb-10 border-b mb-6 md:mb-8 lg:mb-10",
        className,
      )}
    >
      {backLink && (
        <Link
          href={backLink}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <HouseIcon className="h-4 w-4" />
          {backLinkLabel}
        </Link>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {children && (
          <div className="flex items-center gap-2 sm:self-start">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * GridLayout - Flexible grid layout with responsive behavior
 */
export function GridLayout({
  children,
  className,
  cols = 1,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}) {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", colsClasses[cols], className)}>
      {children}
    </div>
  );
}
