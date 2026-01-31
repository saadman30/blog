import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Flex from "./Flex";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Atoms/Flex",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Flex,
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "column", "rowReverse", "columnReverse"],
    },
    justify: {
      control: "select",
      options: ["start", "end", "center", "between", "around"],
    },
    align: {
      control: "select",
      options: ["start", "end", "center", "stretch", "baseline"],
    },
    gap: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    wrap: {
      control: "select",
      options: [true, false, "wrap", "nowrap"],
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <span className={decorators.demoItem}>Item 1</span>
        <span className={decorators.demoItem}>Item 2</span>
        <span className={decorators.demoItem}>Item 3</span>
      </>
    ),
    direction: "row",
    gap: "md",
  },
};

export const Column: Story = {
  args: {
    children: (
      <>
        <span className={decorators.demoItem}>First</span>
        <span className={decorators.demoItem}>Second</span>
        <span className={decorators.demoItem}>Third</span>
      </>
    ),
    direction: "column",
    gap: "sm",
  },
};

export const JustifyBetween: Story = {
  args: {
    children: (
      <>
        <span className={decorators.demoItem}>Start</span>
        <span className={decorators.demoItem}>End</span>
      </>
    ),
    direction: "row",
    justify: "between",
    gap: "md",
  },
};

export const AlignCenter: Story = {
  args: {
    children: (
      <>
        <span className={decorators.demoItem}>Short</span>
        <span className={decorators.demoItem}>
          Taller content to show alignment
        </span>
        <span className={decorators.demoItem}>Mid</span>
      </>
    ),
    direction: "row",
    align: "center",
    gap: "md",
  },
};

export const Wrap: Story = {
  args: {
    children: Array.from({ length: 8 }, (_, i) => (
      <span key={i} className={decorators.demoItem}>
        Item {i + 1}
      </span>
    )),
    direction: "row",
    wrap: true,
    gap: "sm",
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
