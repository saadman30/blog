import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageLayout from "./PageLayout";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Templates/PageLayout",
  component: PageLayout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["narrow", "wide"],
    },
  },
} satisfies Meta<typeof PageLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "narrow",
    children: (
      <div className={decorators.mainNarrow}>
        <h1>Narrow layout (960px)</h1>
        <p>
          Default variant for content pages like blog posts. Constrains width for
          readable line length.
        </p>
      </div>
    ),
  },
};

export const Wide: Story = {
  args: {
    variant: "wide",
    children: (
      <div style={{ padding: "2rem" }}>
        <h1>Wide layout (72rem)</h1>
        <p>
          Wide variant for marketing or dashboard-style pages that use more
          horizontal space.
        </p>
      </div>
    ),
  },
};
