import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SearchBar from "./SearchBar";

const meta = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Search articles" },
};

export const CustomPlaceholder: Story = {
  args: { placeholder: "Search posts..." },
};
