"use client";

import type { Post } from "@/types";

import { estimateReadingMinutes } from "@/lib/readingTime";
import { useBookmarksStore } from "@/store/bookmarksStore";
import { Bookmark, BookmarkCheck } from "lucide-react";
import Text from "@/components/atoms/Text";
import Heading from "@/components/atoms/Heading";
import Section from "@/components/atoms/Section";
import Flex from "@/components/atoms/Flex";
import Button from "@/components/atoms/Button";
import Tag from "@/components/atoms/Tag";
import TagsList from "@/components/molecules/TagsList";
import ScrollProgressBar from "@/components/organisms/ScrollProgress";
import PageLayout from "@/components/templates/PageLayout";

interface Props {
  post: Post;
}

const BlogPostTemplate = ({ post }: Props) => {
  const { isBookmarked, toggleBookmark } = useBookmarksStore();
  const bookmarked = isBookmarked(post.id);

  const readingMinutes =
    post.readingMinutesOverride ?? estimateReadingMinutes(post.body);

  const date = new Date(post.publishedAt);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <>
      <ScrollProgressBar />
      <PageLayout variant="narrow">
        <Section as="article" spacing="lg">
          <Flex direction="column" gap="xl">
            <Flex as="header" direction="column" gap="sm">
              <Text size="xs" uppercase>Article</Text>
              <Heading level="h1">{post.title}</Heading>
              <Flex justify="between" align="center" gap="sm">
                <Text as="span" size="sm" color="muted">
                  {formattedDate} · {readingMinutes} min read
                </Text>
                <Button
                  type="button"
                  variant="ghost"
                  pressed={bookmarked}
                  onClick={() => toggleBookmark(post.id)}
                >
                  {bookmarked ? (
                    <BookmarkCheck size={16} aria-hidden />
                  ) : (
                    <Bookmark size={16} aria-hidden />
                  )}
                  {bookmarked ? "Saved" : "Save"}
                </Button>
              </Flex>
              {post.tags.length ? (
                <TagsList>
                  {post.tags.map((tag) => (
                    <Tag key={tag} label={tag} variant="static" />
                  ))}
                </TagsList>
              ) : null}
            </Flex>
            <Flex direction="column" gap="md">
              {post.body.split(/\n{2,}/).map((para, index) => (
                <Text key={index} as="p" color="default" size="md">
                  {para}
                </Text>
              ))}
            </Flex>
          </Flex>
        </Section>
      </PageLayout>
    </>
  );
};

export default BlogPostTemplate;

