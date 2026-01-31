import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Text from "./Text";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Atoms/Text",
  component: Text,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "muted", "primary", "accent"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    italic: { control: "boolean" },
    as: { control: "select", options: ["p", "span", "div"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default body text." },
};

export const Muted: Story = {
  args: { color: "muted", children: "Muted secondary text." },
};

export const Sizes: Story = {
  render: () => (
    <div className={decorators.stackSm}>
      <Text size="xs">Extra small (xs)</Text>
      <Text size="sm">Small (sm)</Text>
      <Text size="md">Medium (md)</Text>
      <Text size="lg">Large (lg)</Text>
      <Text size="xl">Extra large (xl)</Text>
      <Text size="2xl">2XL</Text>
    </div>
  ),
};

export const Bold: Story = {
  args: { weight: "bold", children: "Bold text." },
};

export const Italic: Story = {
  args: { italic: true, children: "Italic text." },
};
