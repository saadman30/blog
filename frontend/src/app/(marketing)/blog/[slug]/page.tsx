import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { api } from "@/lib/api/client";
import ArticleJsonLd from "@/components/atoms/ArticleJsonLd";
import BlogPostTemplate from "@/components/templates/BlogPost";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.getPostBySlug(slug);
  if (!post) {
    return {
      title: "Article not found • Minimalist Studio"
    };
  }
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonical = `${url}/blog/${post.slug}`;

  return {
    title: `${post.title} • Minimalist Studio`,
    description: post.excerpt,
    alternates: {
      canonical
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: canonical
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await api.getPostBySlug(slug);
  if (!post) {
    return notFound();
  }

  return (
    <>
      <ArticleJsonLd post={post} />
      <BlogPostTemplate post={post} />
    </>
  );
}
