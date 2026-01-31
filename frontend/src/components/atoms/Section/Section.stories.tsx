import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Section from "./Section";
import Flex from "@/components/atoms/Flex";
import Spacing from "@/components/atoms/Spacing";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Atoms/Section",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Section,
  argTypes: {
    spacing: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Section with semantic wrapper and spacing. Layout uses Flex inside; gap via Flex or Spacing.",
    spacing: "md",
  },
};

export const SpacingVariants: Story = {
  render: () => (
    <Flex direction="column" gap="xl">
      <Section spacing="none" ariaLabel="No padding">
        No padding (spacing=&quot;none&quot;)
      </Section>
      <Section spacing="sm" ariaLabel="Small padding">
        Small padding (spacing=&quot;sm&quot;)
      </Section>
      <Section spacing="md" ariaLabel="Medium padding">
        Medium padding (spacing=&quot;md&quot;, default)
      </Section>
      <Section spacing="lg" ariaLabel="Large padding">
        Large padding (spacing=&quot;lg&quot;)
      </Section>
      <Section spacing="xl" ariaLabel="Extra large padding">
        Extra large padding (spacing=&quot;xl&quot;)
      </Section>
    </Flex>
  ),
};

/** Use Flex inside Section for layout; use Flex gap or Spacing for gap between items. */
export const SectionWithFlex: Story = {
  render: () => (
    <Section spacing="md" ariaLabel="Stack of blocks">
      <Flex direction="column" gap="md">
        <div>First block</div>
        <div>Second block</div>
        <div>Third block</div>
      </Flex>
    </Section>
  ),
};

/** Use Spacing for gap-like padding or margin. */
export const SectionWithSpacing: Story = {
  render: () => (
    <Section spacing="md" ariaLabel="Content with spacing">
      <Spacing paddingBlock="md">
        <Flex direction="column" gap="sm">
          <div>Block with padding from Spacing.</div>
          <Spacing asSpacer marginBlock="md" />
          <div>Gap above from Spacing spacer.</div>
        </Flex>
      </Spacing>
    </Section>
  ),
};

export const WithIdAndAriaLabelledBy: Story = {
  args: {
    id: "about",
    ariaLabelledBy: "about-heading",
    spacing: "md",
    children: (
      <>
        <h2 id="about-heading">About</h2>
        <p>Section with id and aria-labelledby for accessibility.</p>
      </>
    ),
  },
};
