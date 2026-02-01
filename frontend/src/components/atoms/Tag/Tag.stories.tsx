import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Tag from "./Tag";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["filter", "static"] },
    label: { control: "text" },
    active: { control: "boolean" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "TypeScript", variant: "filter" },
};

export const Static: Story = {
  args: { label: "React", variant: "static" },
};

export const Active: Story = {
  args: { label: "Selected tag", variant: "filter", active: true },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      <Tag label="Next.js" variant="static" />
      <Tag label="Storybook" variant="static" />
      <Tag label="TypeScript" variant="filter" />
      <Tag label="Active" variant="filter" active />
    </div>
  ),
};
