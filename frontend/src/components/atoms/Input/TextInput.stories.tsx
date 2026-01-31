import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bookmark, Search } from "lucide-react";

import TextInput from "./TextInput";
import decorators from "@/stories/decorators.module.scss";

const meta = {
  title: "Atoms/Input/TextInput",
  component: TextInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    leadingIcon: { control: false },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithLeadingIcon: Story = {
  args: {
    placeholder: "Search...",
    leadingIcon: (
      <span className={decorators.inlineIcon}>
        <Search size={16} aria-hidden />
      </span>
    ),
  },
};

export const WithBookmarkIcon: Story = {
  args: {
    placeholder: "Bookmark search",
    leadingIcon: (
      <span className={decorators.inlineIcon}>
        <Bookmark size={16} aria-hidden />
      </span>
    ),
  },
};
