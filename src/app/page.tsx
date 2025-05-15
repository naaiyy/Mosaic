import HeroSection from "@/features/home/hero-section";
import BlogPreview from "@/features/home/blog-preview";
import { ContentSection } from "@/components/layout/app-layout";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BlogPreview />
    </>
  );
}