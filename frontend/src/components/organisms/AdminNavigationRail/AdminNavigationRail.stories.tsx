import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import AdminNavigationRail from "./AdminNavigationRail";

const meta = {
  title: "Organisms/AdminNavigationRail",
  component: AdminNavigationRail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AdminNavigationRail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

