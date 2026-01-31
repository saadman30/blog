import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "ghost"] },
    children: { control: "text" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Button" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost button" },
};
