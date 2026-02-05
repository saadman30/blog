import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import WriteScreen from "./WriteScreen";
import type { PostEditorData } from "@/lib/types";

const meta = {
  title: "Organisms/WriteScreen",
  component: WriteScreen,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    initialData: { control: false },
  },
} satisfies Meta<typeof WriteScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockInitialData: PostEditorData = {
  post: null,
  status: "draft",
  scheduledFor: null,
  seo: {
    title: "Designing a calmer writing workflow",
    description:
      "A working draft exploring how to keep writing and evaluation on separate screens.",
    slug: "calmer-writing-workflow",
  },
  previewUrl: "https://example.com/blog/calmer-writing-workflow",
};

export const Default: Story = {
  args: {
    initialData: mockInitialData,
  },
};

