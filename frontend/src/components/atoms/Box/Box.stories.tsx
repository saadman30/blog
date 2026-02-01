import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "./Box";

const meta = {
  title: "Atoms/Box",
  component: Box,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["prose", "content", "wide", "narrow", "full"],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <p style={{ margin: 0, color: "var(--text-muted)" }}>
    Content inside the box. Resize the canvas to see how max-width constrains
    the container.
  </p>
);

export const Prose: Story = {
  args: {
    maxWidth: "prose",
    children: placeholder,
  },
};

export const Content: Story = {
  args: {
    maxWidth: "content",
    children: placeholder,
  },
};

export const Wide: Story = {
  args: {
    maxWidth: "wide",
    children: placeholder,
  },
};

export const Narrow: Story = {
  args: {
    maxWidth: "narrow",
    children: (
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Narrow (65ch) — ideal for short lines of text.
      </p>
    ),
  },
};

export const Full: Story = {
  args: {
    maxWidth: "full",
    children: placeholder,
  },
};
