import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ScrollProgressBar from "./ScrollProgressBar";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Organisms/ScrollProgressBar",
  component: ScrollProgressBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Shows scroll progress at the top. Scroll this page to see the bar fill.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <ScrollProgressBar />
      <div className={decorators.scrollDemo}>
        <p>Scroll down to see the progress bar fill.</p>
        <p className={decorators.scrollDemoSpacer}>Halfway there…</p>
        <p className={decorators.scrollDemoSpacer}>Bottom of the page.</p>
      </div>
    </>
  ),
};
