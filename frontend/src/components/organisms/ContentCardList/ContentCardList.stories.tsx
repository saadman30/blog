import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentCardList from "./ContentCardList";
import ContentCard from "@/components/organisms/ContentCard";

const meta = {
  title: "Organisms/ContentCardList",
  component: ContentCardList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ContentCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardItems = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management.",
    tags: ["Next.js", "TypeScript", "Stripe"],
  },
  {
    title: "AI Task Manager",
    description: "Smart task management app with AI-powered scheduling.",
    tags: ["React", "Python", "TensorFlow"],
  },
  {
    title: "Real-time Chat",
    description: "Feature-rich chat with messaging and video calls.",
    tags: ["React", "Socket.io", "WebRTC"],
  },
];

export const Default: Story = {
  render: () => (
    <ContentCardList>
      {cardItems.map((item, i) => (
        <ContentCard
          key={i}
          {...item}
          showMediaPlaceholder
          actions={[
            { label: "Live Demo", href: "#", external: false },
            { label: "View Code", href: "#", external: false },
          ]}
        />
      ))}
    </ContentCardList>
  ),
};
