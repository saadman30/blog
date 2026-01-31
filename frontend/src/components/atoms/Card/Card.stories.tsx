import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "./Card";

const meta = {
  title: "Atoms/Card",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Card,
  argTypes: {
    as: {
      control: "select",
      options: ["div", "article", "section"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Card content with default div wrapper.",
    as: "div",
  },
};

export const AsArticle: Story = {
  args: {
    as: "article",
    children: (
      <>
        <h3>Article card</h3>
        <p>Rendered as an article element for semantic markup.</p>
      </>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    children: (
      <>
        <h3>Section card</h3>
        <p>Rendered as a section element.</p>
      </>
    ),
  },
};
