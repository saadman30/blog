'use client';

import { useMemo, useState, useEffect } from "react";

import type { PostAdminSummary } from "@/lib/types";
import { api } from "@/lib/api/client";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Section from "@/components/atoms/Section";
import Spacing from "@/components/atoms/Spacing";
import Text from "@/components/atoms/Text";
import Table from "@/components/organisms/Table";
import NextLink from "next/link";

type FilterId = "all" | "drafts" | "needsUpdate" | "highTrafficLowCtr";

interface FilterConfig {
  id: FilterId;
  label: string;
}

const FILTERS: FilterConfig[] = [
  { id: "all", label: "All" },
  { id: "drafts", label: "Drafts" },
  { id: "needsUpdate", label: "Needs update" },
  { id: "highTrafficLowCtr", label: "High traffic / low CTR" },
];

const HIGH_TRAFFIC_MIN_VIEWS = 1000;
const LOW_CTR_MAX = 0.08;

const PostsPage = () => {
  const [posts, setPosts] = useState<PostAdminSummary[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  useEffect(() => {
    let isMounted = true;

    api
      .listAdminPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load admin posts", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    switch (activeFilter) {
      case "drafts":
        return posts.filter((post) => post.status === "draft");
      case "needsUpdate":
        return posts.filter((post) => post.seoHealth !== "healthy");
      case "highTrafficLowCtr":
        return posts.filter(
          (post) =>
            post.viewsLast30Days >= HIGH_TRAFFIC_MIN_VIEWS &&
            post.clickThroughRate <= LOW_CTR_MAX
        );
      default:
        return posts;
    }
  }, [posts, activeFilter]);

  const formatDate = (iso: string | null) => {
    if (!iso) {
      return "—";
    }
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAge = (publishedAt: string | null) => {
    if (!publishedAt) {
      return "Unpublished";
    }
    const now = Date.now();
    const then = new Date(publishedAt).getTime();
    const days = Math.max(1, Math.round((now - then) / (1000 * 60 * 60 * 24)));
    return `${days}d`;
  };

  const formatSeoHealth = (value: PostAdminSummary["seoHealth"]) => {
    if (value === "healthy") return "Healthy";
    if (value === "needs_attention") return "Needs attention";
    return "At risk";
  };

  return (
    <Section
      as="section"
      spacing="lg"
      ariaLabel="Manage posts"
      variant="stacked"
    >
      <Flex as="header" justify="between" align="start" gap="lg">
        <Flex as="div" direction="column" gap="xs">
          <Heading level="h1">Posts</Heading>
          <Text as="p" size="sm" color="muted">
            Make clear decisions about what to write next. Editing always
            happens in the Write screen.
          </Text>
        </Flex>
        <Flex as="div" gap="sm" wrap>
          {FILTERS.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant="ghost"
              pressed={filter.id === activeFilter}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Spacing marginBlock="md">
        <Table
          aria-label="Posts overview"
          header={
            <tr>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  Status
                </Text>
              </th>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  Title
                </Text>
              </th>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  Last updated
                </Text>
              </th>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  Views (30d)
                </Text>
              </th>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  SEO health
                </Text>
              </th>
              <th scope="col">
                <Text as="span" size="xs" color="muted" uppercase>
                  Age
                </Text>
              </th>
            </tr>
          }
          body={
            <>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Text
                      as="span"
                      size="xs"
                      color={post.status === "draft" ? "muted" : "default"}
                      weight="medium"
                    >
                      {post.status === "draft"
                        ? "Draft"
                        : post.status === "scheduled"
                          ? "Scheduled"
                          : "Published"}
                    </Text>
                  </td>
                  <td>
                    <NextLink href={`/app/write?postId=${post.id}`}>
                      <Text as="span" size="sm" weight="medium">
                        {post.title}
                      </Text>
                    </NextLink>
                  </td>
                  <td>
                    <Text as="span" size="sm" color="muted">
                      {formatDate(post.lastUpdatedAt)}
                    </Text>
                  </td>
                  <td>
                    <Text as="span" size="sm">
                      {post.viewsLast30Days.toLocaleString()}
                    </Text>
                  </td>
                  <td>
                    <Text
                      as="span"
                      size="xs"
                      weight="medium"
                      color={post.seoHealth === "healthy" ? "primary" : "accent"}
                    >
                      {formatSeoHealth(post.seoHealth)}
                    </Text>
                  </td>
                  <td>
                    <Text as="span" size="sm" color="muted">
                      {formatAge(post.publishedAt)}
                    </Text>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <Text as="p" size="sm" color="muted">
                      No posts match this filter yet.
                    </Text>
                  </td>
                </tr>
              )}
            </>
          }
        />
      </Spacing>
    </Section>
  );
};

export default PostsPage;

