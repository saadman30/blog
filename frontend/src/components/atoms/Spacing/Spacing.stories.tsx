import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Spacing from "./Spacing";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Atoms/Spacing",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Spacing,
  argTypes: {
    paddingBlock: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    paddingInline: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    marginBlock: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    marginInline: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    padding: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    margin: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    asSpacer: { control: "boolean" },
  },
} satisfies Meta<typeof Spacing>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <span className={decorators.demoItem}>Content with padding</span>
    ),
    padding: "md",
  },
};

export const PaddingSizes: Story = {
  render: () => (
    <div className={decorators.stack}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Spacing key={size} padding={size}>
          <span className={decorators.demoItem}>padding {size}</span>
        </Spacing>
      ))}
    </div>
  ),
};

export const PaddingBlockAndInline: Story = {
  args: {
    children: (
      <span className={decorators.demoItem}>
        paddingBlock: lg, paddingInline: md
      </span>
    ),
    paddingBlock: "lg",
    paddingInline: "md",
  },
};

export const MarginBlock: Story = {
  render: () => (
    <div>
      <div className={decorators.demoItem}>Section above</div>
      <Spacing marginBlock="lg" asSpacer />
      <div className={decorators.demoItem}>Section below (marginBlock lg)</div>
    </div>
  ),
};

export const AsSpacer: Story = {
  render: () => (
    <div>
      <span className={decorators.demoItem}>First block</span>
      <Spacing asSpacer marginBlock="md" />
      <span className={decorators.demoItem}>Second block (spacer between)</span>
      <Spacing asSpacer marginBlock="xl" />
      <span className={decorators.demoItem}>Third block</span>
    </div>
  ),
};

export const InlineMargin: Story = {
  args: {
    children: (
      <span className={decorators.demoItem}>Content with margin inline</span>
    ),
    marginInline: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ border: "1px dashed var(--border-default)", padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};
