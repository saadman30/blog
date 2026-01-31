import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Section from "./Section";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Atoms/Section",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Section,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "grid", "content", "stack", "intro"],
    },
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Section content with no layout variant.",
    variant: "default",
  },
};

export const Grid: Story = {
  args: {
    variant: "grid",
    ariaLabel: "Grid of items",
    children: (
      <>
        <div className={decorators.demoItem}>Item 1</div>
        <div className={decorators.demoItem}>Item 2</div>
        <div className={decorators.demoItem}>Item 3</div>
      </>
    ),
  },
};

export const Content: Story = {
  args: {
    variant: "content",
    children: (
      <>
        <p>First paragraph with prose-style spacing.</p>
        <p>Second paragraph gets margin from content variant.</p>
        <ul>
          <li>List item one</li>
          <li>List item two</li>
        </ul>
      </>
    ),
  },
};

export const Stack: Story = {
  args: {
    variant: "stack",
    children: (
      <>
        <div>First block</div>
        <div>Second block</div>
        <div>Third block</div>
      </>
    ),
  },
};

export const Intro: Story = {
  args: {
    variant: "intro",
    ariaLabel: "Page introduction",
    children: (
      <>
        <div>Eyebrow / label</div>
        <div>Heading</div>
        <div>Description text</div>
      </>
    ),
  },
};

export const WithIdAndAriaLabelledBy: Story = {
  args: {
    id: "about",
    ariaLabelledBy: "about-heading",
    variant: "default",
    children: (
      <>
        <h2 id="about-heading">About</h2>
        <p>Section with id and aria-labelledby for accessibility.</p>
      </>
    ),
  },
};
