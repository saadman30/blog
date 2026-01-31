import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BlogPostTemplate from "./BlogPost";
import { mockPost } from "@/stories/mockData";

const meta = {
  title: "Templates/BlogPost",
  component: BlogPostTemplate,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    post: { control: false },
  },
} satisfies Meta<typeof BlogPostTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: mockPost },
};
