import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BlogIndexTemplate from "./BlogIndex";
import { mockPosts } from "@/lib/mockData";

const meta = {
  title: "Templates/BlogIndex",
  component: BlogIndexTemplate,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    posts: { control: false },
  },
} satisfies Meta<typeof BlogIndexTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { posts: mockPosts },
};

export const Empty: Story = {
  args: { posts: [] },
};

export const SinglePost: Story = {
  args: { posts: mockPosts.slice(0, 1) },
};
