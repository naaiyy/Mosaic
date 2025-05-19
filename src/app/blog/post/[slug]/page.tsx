import { notFound } from "next/navigation";
import { ContentSection, PageHeader } from "@/components/layout/app-layout";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getPost } from "@pastapp/mosaic";
import Image from "next/image";
import { createMosaicConfig } from "@pastapp/mosaic";

// Create Mosaic configuration
const mosaicConfig = createMosaicConfig({
  apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3000/api/v1",
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
    // Use the server-side getPost function
    const response = await getPost(mosaicConfig, slug);
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

  const { post } = await getBlogPost(slug);

  if (!post) {
    return notFound();
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
      <PageHeader
        title="Blog"
        backLink="/blog"
        backLinkLabel="Back to blog"
      >
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
              <div dangerouslySetInnerHTML={{ __html: content }} />
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
