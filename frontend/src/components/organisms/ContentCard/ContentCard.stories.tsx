import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentCard from "./ContentCard";
import decorators from "@/styles/decorators.module.scss";

const meta = {
  title: "Organisms/ContentCard",
  component: ContentCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    tags: { control: "object" },
    actions: { control: false },
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    showMediaPlaceholder: true,
    actions: [
      { label: "Live Demo", href: "#", external: false },
      { label: "View Code", href: "#", external: false },
    ],
  },
};

export const WithoutMedia: Story = {
  args: {
    title: "API Service",
    description: "REST API with authentication and rate limiting.",
    tags: ["Node.js", "Express", "PostgreSQL"],
    actions: [{ label: "Docs", href: "#", external: true }],
  },
};

export const NoTagsOrActions: Story = {
  args: {
    title: "Simple Feature",
    description: "A card with only title and description.",
  },
};

export const CardGrid: Story = {
  render: () => (
    <ul className={decorators.cardGrid} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {[
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
      ].map((item, i) => (
        <li key={i}>
          <ContentCard
            {...item}
            showMediaPlaceholder
            actions={[
              { label: "Live Demo", href: "#", external: false },
              { label: "View Code", href: "#", external: false },
            ]}
          />
        </li>
      ))}
    </ul>
  ),
};
