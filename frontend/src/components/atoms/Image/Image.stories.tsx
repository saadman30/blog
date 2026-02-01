import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "./Image";

const placeholderSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23ddd' width='400' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18'%3EImage%3C/text%3E%3C/svg%3E";

const meta = {
  title: "Atoms/Image",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  component: Image,
  argTypes: {
    aspectRatio: {
      control: "select",
      options: ["square", "16/9", "16/10", "auto"],
    },
    radius: {
      control: "select",
      options: ["default", "none"],
    },
    objectFit: {
      control: "select",
      options: ["cover", "contain", "fill", "none"],
    },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: placeholderSrc,
    alt: "Placeholder image",
    aspectRatio: "square",
    radius: "default",
    objectFit: "cover",
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Image {...args} />
    </div>
  ),
};

export const Square: Story = {
  args: {
    src: placeholderSrc,
    alt: "Square aspect ratio",
    aspectRatio: "square",
    radius: "default",
  },
  render: (args) => (
    <div style={{ width: 200 }}>
      <Image {...args} />
    </div>
  ),
};

export const Wide: Story = {
  args: {
    src: placeholderSrc,
    alt: "16:9 aspect ratio",
    aspectRatio: "16/9",
    radius: "default",
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
};

export const Intrinsic: Story = {
  args: {
    src: placeholderSrc,
    alt: "Fixed dimensions",
    fill: false,
    width: 200,
    height: 150,
    radius: "default",
  },
};

export const PlaceholderOnly: Story = {
  args: {
    showPlaceholder: true,
    aspectRatio: "16/10",
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
};
