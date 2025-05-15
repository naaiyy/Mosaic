'use client';

import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { ContentSection } from '@/components/layout/app-layout';

export default function BlogPreview() {
  return (
    <ContentSection className="py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-4">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Blog</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Check out our latest blog posts
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get the latest updates, news, and insights from our blog. We cover a wide range of topics.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          View All Posts
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </ContentSection>
  );
}
