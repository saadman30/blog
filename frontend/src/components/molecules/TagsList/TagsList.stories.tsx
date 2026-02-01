import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TagsList from "./TagsList";
import Tag from "@/components/atoms/Tag";

const meta = {
  title: "Molecules/TagsList",
  component: TagsList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TagsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TagsList>
      <Tag label="React" variant="static" />
      <Tag label="TypeScript" variant="static" />
      <Tag label="Next.js" variant="static" />
    </TagsList>
  ),
};

export const FilterTags: Story = {
  render: () => (
    <TagsList>
      <Tag label="storybook" variant="filter" onClick={fn()} />
      <Tag label="components" variant="filter" onClick={fn()} />
      <Tag label="documentation" variant="filter" active onClick={fn()} />
    </TagsList>
  ),
};

export const ManyTags: Story = {
  render: () => (
    <TagsList>
      {["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL", "Storybook"].map(
        (label) => (
          <Tag key={label} label={label} variant="static" />
        )
      )}
    </TagsList>
  ),
};
