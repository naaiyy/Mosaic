'use client';

import Link from 'next/link';
import { ContentSection } from '@/components/layout/app-layout';

export default function HeroSection() {
  return (
    <ContentSection className="py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Mosaic CMS
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            A modern content management system built with Next.js, Supabase, and Drizzle
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link
            href="/blog"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View Blog
          </Link>
        </div>
      </div>
    </ContentSection>
  );
}
