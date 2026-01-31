import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RootLayoutShell from "./RootLayoutShell";
import decorators from "@/stories/decorators.module.scss";

const meta = {
  title: "Layout/RootLayoutShell",
  component: RootLayoutShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof RootLayoutShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <main className={decorators.mainNarrow}>
        <p>Main content area. The shell provides header, nav, theme toggle, and footer.</p>
      </main>
    ),
  },
};
