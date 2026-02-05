import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MediaScreen from "./MediaScreen";
import type { MediaItem } from "@/lib/types";

const meta = {
  title: "Organisms/MediaScreen",
  component: MediaScreen,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    items: { control: false },
  },
} satisfies Meta<typeof MediaScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMediaItems: MediaItem[] = [
  {
    id: "hero-1",
    url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    alt: "Designer working in a minimal workspace",
    type: "image",
    usageCount: 5,
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "hero-2",
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    alt: "Small team collaborating at a table",
    type: "image",
    usageCount: 3,
    createdAt: "2025-01-12T11:30:00.000Z",
  },
  {
    id: "thumbnail-1",
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    alt: "Soft focus notebook and mug on a desk",
    type: "image",
    usageCount: 1,
    createdAt: "2025-01-20T16:45:00.000Z",
  },
];

export const Default: Story = {
  args: {
    items: mockMediaItems,
  },
};

