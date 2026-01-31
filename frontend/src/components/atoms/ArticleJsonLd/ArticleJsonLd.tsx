import type { Post } from "@/types";

interface Props {
  post: Post;
}

/**
 * Renders JSON-LD Article schema for SEO. Use only in Server Components (e.g. the blog post page).
 */
function ArticleJsonLd({ post }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.excerpt,
    articleSection: post.tags
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default ArticleJsonLd;
