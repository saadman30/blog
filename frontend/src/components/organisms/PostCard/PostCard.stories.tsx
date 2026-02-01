import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import PostCard from "./PostCard";
import { mockPost, mockPosts } from "@/lib/mockData";

const meta = {
  title: "Organisms/PostCard",
  component: PostCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    post: { control: false },
    onTagClick: { action: "tag clicked" },
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: mockPost },
};

export const WithTagClick: Story = {
  args: { post: mockPost, onTagClick: fn() },
};

export const List: Story = {
  render: () => (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px" }}>
      {mockPosts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} onTagClick={fn()} />
        </li>
      ))}
    </ul>
  ),
};
