import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SettingsScreen from "./SettingsScreen";
import type { AdminSettings } from "@/lib/types";

const meta = {
  title: "Organisms/SettingsScreen",
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    settings: { control: false },
  },
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSettings: AdminSettings = {
  seoDefaults: {
    defaultTitleSuffix: "— Studio Notebook",
    defaultDescription:
      "A calm, opinionated writing studio for long-lived essays and posts.",
    defaultOgImageUrl: "https://example.com/og/default.jpg",
  },
  authorName: "Alex Writer",
  authorBio:
    "Writes slow, durable essays about software teams, tools, and attention.",
  integrations: {
    rssEnabled: true,
    emailDigestEnabled: false,
  },
};

export const Default: Story = {
  args: {
    settings: mockSettings,
  },
};

