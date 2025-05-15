import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";
// Import all types and components directly from the root package
import { MosaicBlogList, createMosaicConfig, getPosts } from "@pastapp/mosaic";
import type { BlogPost, MosaicPost } from "@pastapp/mosaic";
import { ContentSection, PageHeader, GridLayout } from "@/components/layout/app-layout";

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
		// Cast to extended type and default empty destinations array if none provided
		const extendedPost = post as ExtendedMosaicPost;
		const destinations = extendedPost.publishDestinations || [];
		
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
			parsedDestinations: destinations.map(dest => ({
				id: typeof dest.id === 'number' ? dest.id : Number(dest.id) || 0,
				name: dest.name || '',
				type: dest.type || 'unknown',
				status: dest.status
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
	apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3001/api",
	apiKey: process.env.MOSAIC_API_KEY,
	site: {
		domain: "example.com",
	},
	// Auto-register routes
	autoDetectRoutes: true,
});

// Server action to fetch posts
async function getBlogPosts(page = 1, limit = 12) {
	"use server";

	try {
		// Use the server-side getPosts function directly
		const response = await getPosts(mosaicConfig, {
			page,
			limit,
		});

		return {
			posts: response.posts,
			pagination: response.pagination,
		};
	} catch (error) {
		console.error("Failed to fetch posts:", error);
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
