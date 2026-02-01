"use client";

import type { Post } from "@/types";

import { estimateReadingMinutes } from "@/lib/readingTime";
import styles from "./PostCard.module.scss";
import Link from "@/components/atoms/Link";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Flex from "@/components/atoms/Flex";
import { useBookmarksStore } from "@/store/bookmarksStore";
import { Bookmark, BookmarkCheck } from "lucide-react";
import PostTag from "@/components/molecules/PostTag";

interface Props {
  post: Post;
  onTagClick?: (tag: string) => void;
}

const PostCard = ({ post, onTagClick }: Props) => {
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
    <Card as="article">
      <Flex justify="between" align="center" gap="sm">
        <Text as="span" color="muted" size="xs">
          {formattedDate} · {readingMinutes} min read
        </Text>
        <Button
          type="button"
          variant="ghost"
          pressed={bookmarked}
          onClick={() => toggleBookmark(post.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Save to bookmarks"}
        >
          {bookmarked ? (
            <BookmarkCheck size={16} aria-hidden />
          ) : (
            <Bookmark size={16} aria-hidden />
          )}
        </Button>
      </Flex>
      <Flex justify="between" align="start" gap="md">
        <Link href={`/blog/${post.slug}`} variant="cardTitle">
          {post.title}
        </Link>
      </Flex>
      <div className={styles.excerpt}>
        <Text color="muted" size="sm" as="p">
          {post.excerpt}
        </Text>
      </div>
      <Flex wrap gap="xs">
        {post.tags.map((tag) => (
          <PostTag
            key={tag}
            label={tag}
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
          />
        ))}
      </Flex>
    </Card>
  );
};

export default PostCard;

