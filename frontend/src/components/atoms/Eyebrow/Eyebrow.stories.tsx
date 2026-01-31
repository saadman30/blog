import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Eyebrow from "./Eyebrow";
import Heading from "../Heading";

const meta = {
  title: "Atoms/Eyebrow",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Journal",
  },
};

export const WithHeading: Story = {
  render: () => (
    <header>
      <Eyebrow>Article</Eyebrow>
      <Heading level="h1">Getting Started with Storybook</Heading>
    </header>
  ),
};
