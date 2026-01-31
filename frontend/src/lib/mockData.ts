import type { Post } from "@/types";

export const mockPost: Post = {
  id: 1,
  slug: "getting-started-with-storybook",
  title: "Getting Started with Storybook",
  excerpt:
    "Learn how to build and document UI components in isolation with Storybook.",
  body: "Storybook is a frontend workshop for building UI components and pages in isolation.\n\nIt helps you develop hard-to-reach states and edge cases without needing to run the whole app.\n\nYou can also use it to document your design system and share components across your team.",
  tags: ["storybook", "components", "documentation"],
  publishedAt: "2025-01-15T10:00:00.000Z",
  readingMinutesOverride: 5,
};

export const mockPosts: Post[] = [
  mockPost,
  {
    ...mockPost,
    id: 2,
    slug: "writing-great-stories",
    title: "Writing Great Stories",
    excerpt: "Best practices for writing clear, reusable stories.",
    body: "A good story captures the essential states of a component.\n\nUse args and argTypes to make props configurable in the Controls panel.",
    tags: ["storybook", "writing"],
    publishedAt: "2025-01-20T12:00:00.000Z",
    readingMinutesOverride: 3,
  },
  {
    ...mockPost,
    id: 3,
    slug: "accessibility-testing",
    title: "Accessibility Testing in Storybook",
    excerpt: "Use the a11y addon to catch accessibility issues early.",
    body: "The a11y addon runs automated checks and highlights contrast and ARIA issues.",
    tags: ["accessibility", "testing"],
    publishedAt: "2025-01-25T09:00:00.000Z",
    readingMinutesOverride: 4,
  },
];
