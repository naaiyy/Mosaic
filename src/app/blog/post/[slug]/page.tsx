import { ContentSection, PageHeader } from "@/components/layout/app-layout";
import SanitizedHtml from "@/components/sanitized-html";
import { getPost } from "@pastapp/mosaic";
import { createMosaicConfig } from "@pastapp/mosaic";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { notFound } from "next/navigation";

// Create Mosaic configuration
const mosaicConfig = createMosaicConfig({
  apiUrl:
    process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3000/api/v1",
  apiKey: process.env.MOSAIC_API_KEY,
  site: {
    domain: "example.com",
  },
  autoDetectRoutes: false,
});

// Server action to fetch a single post
async function getBlogPost(slug: string) {
  "use server";

  try {
    // Log request details for debugging
    console.log(`[DEBUG] Fetching post with slug: ${slug}`);
    console.log(`[DEBUG] API URL: ${mosaicConfig.apiUrl}/blog/${slug}`);

    // Use the server-side getPost function
    const response = await getPost(mosaicConfig, slug);

    // Debug log the response
    console.log(`[DEBUG] Post found: ${!!response?.post}`);
    if (!response?.post) {
      console.log(`[DEBUG] Post not found with slug: ${slug}`);
    }

    return response;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    throw new Error(`Failed to load blog post: ${slug}`);
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // In Next.js 15.3.1+, params and searchParams are now Promises
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch the post data
  const response = await getBlogPost(slug);
  const { post } = response;

  if (!post) {
    // Provide a more helpful UI instead of just showing the default 404 page
    return (
      <>
        <PageHeader
          title="Post Not Found"
          backLink="/blog"
          backLinkLabel="Back to blog"
        >
          <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
        </PageHeader>

        <ContentSection>
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold mb-4 text-destructive">
              Post Not Found
            </h1>
            <p className="text-lg mb-6">
              We couldn't find a blog post with the slug:{" "}
              <code className="bg-muted px-2 py-1 rounded">{slug}</code>
            </p>
            <p className="text-muted-foreground mb-8">
              This could be because the post doesn't exist, has been removed, or
              the URL is incorrect.
            </p>
            <a
              href="/blog"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Blog
            </a>
          </div>
        </ContentSection>
      </>
    );
  }

  // Parse content if it's a string
  let content = post.content;
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (e) {
      console.warn("Could not parse post content JSON:", e);
    }
  }

  return (
    <>
      <PageHeader title="Blog" backLink="/blog" backLinkLabel="Back to blog">
        <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
      </PageHeader>

      <ContentSection>
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            {post.publishedAt && (
              <div className="text-sm text-muted-foreground mb-4">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {post.featuredImage && (
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="object-cover"
                />
              </div>
            )}

            {post.excerpt && (
              <div className="text-lg text-muted-foreground mb-8">
                {post.excerpt}
              </div>
            )}
          </div>

          {/* Render the content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {typeof content === "string" ? (
              <SanitizedHtml html={content} />
            ) : (
              <div className="p-4 border border-muted rounded-md">
                <p>Content preview:</p>
                <pre className="mt-2 text-sm bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </article>
      </ContentSection>
    </>
  );
}
