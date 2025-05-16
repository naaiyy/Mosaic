import { ContentSection } from "@/components/layout/app-layout";
import BlogPreview from "@/features/home/blog-preview";
import HeroSection from "@/features/home/hero-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BlogPreview />
    </>
  );
}
