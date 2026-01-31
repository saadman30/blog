import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ArticleJsonLd from "./ArticleJsonLd";
import { mockPost } from "@/stories/mockData";

const meta = {
  title: "Atoms/ArticleJsonLd",
  component: ArticleJsonLd,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    post: { control: false },
  },
} satisfies Meta<typeof ArticleJsonLd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: mockPost },
};
