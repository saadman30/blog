import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import PostTag from "./PostTag";
import decorators from "@/stories/decorators.module.scss";

const meta = {
  title: "Molecules/PostTag",
  component: PostTag,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    active: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof PostTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "storybook" },
};

export const Active: Story = {
  args: { label: "documentation", active: true },
};

export const Group: Story = {
  render: () => (
    <div className={decorators.wrap}>
      <PostTag label="storybook" />
      <PostTag label="documentation" active />
      <PostTag label="components" />
      <PostTag label="testing" />
    </div>
  ),
};
