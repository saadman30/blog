import { render, screen } from "@testing-library/react";

import type { PostInsight } from "@/lib/types";

import InsightsScreen from "./InsightsScreen";

const makeInsight = (overrides: Partial<PostInsight>): PostInsight => ({
  id: "1",
  kind: "topPosts",
  title: "Top posts (30 days)",
  description: "Your highest-performing posts this month.",
  posts: [],
  action: {
    label: "View posts",
    href: "/app/posts"
  },
  ...overrides
});

describe("InsightsScreen", () => {
  it("renders insight cards", () => {
    render(<InsightsScreen insights={[makeInsight({})]} />);

    expect(
      screen.getByText(/top posts/i)
    ).toBeInTheDocument();
  });
});

