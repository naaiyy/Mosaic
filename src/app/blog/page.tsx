import {
  ContentSection,
  GridLayout,
  PageHeader,
} from "@/components/layout/app-layout";
// Import all types and components directly from the root package
import { MosaicBlogList, createMosaicConfig, getPosts } from "@pastapp/mosaic";
import type { BlogPost, MosaicPost } from "@pastapp/mosaic";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

// Define a type for destination objects that might be in MosaicPost
type Destination = {
  id: string | number;
  name?: string;
  type?: string;
  status?: string;
};

// Extend MosaicPost with our expected structure
interface ExtendedMosaicPost extends MosaicPost {
  publishDestinations?: Destination[];
}

// Adapter function to convert MosaicPost to BlogPost format
function adaptPostsToMosaicFormat(posts: MosaicPost[]): BlogPost[] {
  return posts.map((post) => {
    // Cast to extended type and ensure destinations is always an array
    const extendedPost = post as ExtendedMosaicPost;
    // Handle different possible formats of publishDestinations
    let destinations = [];
    if (extendedPost.publishDestinations) {
      if (Array.isArray(extendedPost.publishDestinations)) {
        destinations = extendedPost.publishDestinations;
      } else if (typeof extendedPost.publishDestinations === 'string') {
        try {
          // Attempt to parse if it's a JSON string
          const parsed = JSON.parse(extendedPost.publishDestinations);
          destinations = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.warn('Could not parse publishDestinations string:', e);
          destinations = [];
        }
      }
    }

    // Create a properly typed BlogPost object
    const blogPost: BlogPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      // Convert content object to string
      content:
        typeof post.content === "string"
          ? post.content
          : JSON.stringify(post.content),
      excerpt: post.excerpt || null,
      featuredImage: post.featuredImage || null,
      status: post.status,
      // Convert labels array to string
      labels: Array.isArray(post.labels) ? JSON.stringify(post.labels) : null,
      seoTitle: post.seoTitle || null,
      seoDescription: post.seoDescription || null,
      // Add the parsed destinations field required by the updated SDK
      parsedDestinations: destinations.map((dest) => ({
        id: typeof dest.id === "number" ? dest.id : Number(dest.id) || 0,
        name: dest.name || "",
        type: dest.type || "unknown",
        status: dest.status,
      })),
      // Required fields that might not be in MosaicPost
      publishDestinations: "",
      projectId: 0,
      authorId: post.authorId,
      // Convert publishedAt string to Date or null
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return blogPost;
  });
}

// Create Mosaic configuration
const mosaicConfig = createMosaicConfig({
  // Point to the correct PAST API running on port 3000
  apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3000/api/v1",
  apiKey: process.env.MOSAIC_API_KEY,
  site: {
    domain: "example.com",
  },
  autoDetectRoutes: false,
});

// Server action to fetch posts
async function getBlogPosts(page = 1, limit = 12) {
  "use server";

  try {
    // Log the configuration and request details
    console.log("[DEBUG] Mosaic config:", JSON.stringify({
      apiUrl: mosaicConfig.apiUrl,
      autoDetectRoutes: mosaicConfig.autoDetectRoutes,
      site: mosaicConfig.site,
    }));
    console.log("[DEBUG] Request params:", JSON.stringify({ page, limit, path: "/blog" }));

    // Try with path parameter explicitly set
    const response = await getPosts(mosaicConfig, {
      page,
      limit,
      path: "/blog",
    });

    console.log("[DEBUG] Response success:", !!response?.posts);
    return {
      posts: response.posts,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("[DEBUG] Error details:", error);
    throw new Error("Failed to load blog posts");
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // In Next.js 15.3.1+, params and searchParams are now Promises
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;

  return (
    <>
      <PageHeader
        title="Blog"
        description="Explore our latest articles and insights"
        backLink="/"
        backLinkLabel="Home"
      />

      <ContentSection>
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogPostsList page={page} />
        </Suspense>
      </ContentSection>
    </>
  );
}

// Component that loads the blog posts
async function BlogPostsList({ page }: { page: number }) {
  const { posts, pagination } = await getBlogPosts(page);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
        <ArrowClockwise className="h-10 w-10 mb-4" />
        <p>No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MosaicBlogList posts={adaptPostsToMosaicFormat(posts)} />

      {/* Pagination UI */}
      {pagination?.hasMore && (
        <div className="flex justify-center gap-2 mt-8">
          {/* Calculate total pages based on total items and limit */}
          {Array.from({
            length: Math.ceil(pagination.totalItems / (pagination.limit || 12)),
          }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <a
                key={`page-${pageNumber}`}
                href={`/blog?page=${pageNumber}`}
                className={`px-4 py-2 rounded-md ${
                  page === pageNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {pageNumber}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Loading skeleton
function BlogListSkeleton() {
  return (
    <GridLayout cols={3}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`skeleton-${i}-${Date.now()}`}
          className="h-[320px] rounded-lg bg-muted animate-pulse"
        />
      ))}
    </GridLayout>
  );
}
