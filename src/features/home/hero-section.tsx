"use client";

import { ContentSection } from "@/components/layout/app-layout";
import Link from "next/link";

export default function HeroSection() {
  return (
    <ContentSection>
      <div className="flex flex-col items-center justify-center py-12 md:py-20 lg:py-28">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Mosaic
        </h1>
      </div>
    </ContentSection>
  );
}
