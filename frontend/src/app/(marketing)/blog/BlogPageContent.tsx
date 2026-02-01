"use client";

import type { Post } from "@/types";

import Text from "@/components/atoms/Text";
import Heading from "@/components/atoms/Heading";
import Flex from "@/components/atoms/Flex";
import Section from "@/components/atoms/Section";
import SearchBar from "@/components/molecules/SearchBar";
import PostTag from "@/components/molecules/PostTag";
import PostCard from "@/components/organisms/PostCard";
import PageLayout from "@/components/templates/PageLayout";
import { useBlogFiltersStore } from "@/store/blogFiltersStore";

interface Props {
  posts: Post[];
}

const collectTags = (posts: Post[]): string[] => {
  const set = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};

export default function BlogPageContent({ posts }: Props) {
  const { query, tag, setTag } = useBlogFiltersStore();
  const tags = collectTags(posts);

  const filtered = posts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesTag = !tag || post.tags.includes(tag);
    return matchesQuery && matchesTag;
  });

  return (
    <PageLayout variant="narrow">
      <Section spacing="md" ariaLabel="Blog index introduction">
        <Flex direction="column" gap="sm">
          <Text size="xs" uppercase>Journal</Text>
          <Heading level="h1">Writing about product, design, and engineering.</Heading>
          <Text color="muted">
            Long-form, timeless essays focused on clarity, systems, and craft.
            Minimal interface, maximal signal.
          </Text>
          <Flex justify="between" align="center">
            <SearchBar />
            <Text as="span" color="muted" size="sm">{filtered.length} posts</Text>
          </Flex>
          {tags.length > 0 ? (
            <Flex wrap gap="xs" aria-label="Filter by tag">
              {tags.map((value) => (
                <PostTag
                  key={value}
                  label={value}
                  active={tag === value}
                  onClick={() => setTag(tag === value ? null : value)}
                />
              ))}
            </Flex>
          ) : null}
        </Flex>
      </Section>
      <Section spacing="md" ariaLabel="Blog posts">
        <Flex direction="column" gap="md">
          {filtered.length === 0 ? (
            <Text color="muted" size="sm" as="p">
              No posts match this filter yet. Try clearing search or tags.
            </Text>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTagClick={(value) => setTag(value)}
              />
            ))
          )}
        </Flex>
      </Section>
    </PageLayout>
  );
}
