import { api } from "@/lib/api/client";
import BlogIndexTemplate from "@/components/templates/BlogIndex";

// Mark this route as dynamic so it isn't statically prerendered at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog • Minimalist Studio",
  description:
    "Long-form writing on product, engineering, and design from Minimalist Studio."
};

export default async function BlogPage() {
  const posts = await api.listPosts();
  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return <BlogIndexTemplate posts={sorted} />;
}
