import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Heading from "./Heading";
import decorators from "@/stories/decorators.module.scss";

const meta = {
  title: "Atoms/Heading",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Heading,
  argTypes: {
    level: { control: "select", options: ["h1", "h2", "h3"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <div className={decorators.stack}>
      <Heading level="h1">Heading 1</Heading>
      <Heading level="h2">Heading 2</Heading>
      <Heading level="h3">Heading 3</Heading>
    </div>
  ),
};

export const Default: Story = {
  args: {
    level: "h1",
    children: "Page title",
  },
};
