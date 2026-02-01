import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "./Link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["brand", "nav", "cta", "button", "inline", "cardTitle"],
    },
    href: { control: "text" },
    external: { control: "boolean" },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: { href: "/example", variant: "inline", children: "Inline link" },
};

export const Brand: Story = {
  args: { href: "/", variant: "brand", children: "Minimalist Studio" },
};

export const Nav: Story = {
  args: { href: "/about", variant: "nav", children: "About" },
};

export const Cta: Story = {
  args: { href: "#section", variant: "cta", children: "See What I Do" },
};

export const Button: Story = {
  args: {
    href: "https://github.com",
    variant: "button",
    external: true,
    children: "GitHub",
  },
};

export const CardTitle: Story = {
  args: {
    href: "/blog/my-post",
    variant: "cardTitle",
    children: "Blog post title",
  },
};

export const ExternalInline: Story = {
  args: {
    href: "https://example.com",
    variant: "inline",
    external: true,
    children: "External link",
  },
};
