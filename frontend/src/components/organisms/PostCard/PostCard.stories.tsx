import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import PostCard from "./PostCard";
import { mockPost, mockPosts } from "@/stories/mockData";
import decorators from "@/stories/decorators.module.scss";

const meta = {
  title: "Organisms/PostCard",
  component: PostCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    post: { control: false },
    onTagClick: { action: "tagClicked" },
  },
  args: { onTagClick: fn() },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: mockPost },
};

export const WithTagClick: Story = {
  args: {
    post: mockPost,
    onTagClick: (tag: string) => console.log("Tag clicked:", tag),
  },
};

export const CardGrid: Story = {
  render: () => (
    <div className={decorators.cardGrid}>
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  ),
};
