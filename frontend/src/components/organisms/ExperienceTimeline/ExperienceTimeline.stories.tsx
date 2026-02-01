import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ExperienceTimeline from "./ExperienceTimeline";
import type { ExperienceItem } from "./ExperienceTimeline";

const meta = {
  title: "Organisms/ExperienceTimeline",
  component: ExperienceTimeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    items: { control: false },
  },
} satisfies Meta<typeof ExperienceTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems: ExperienceItem[] = [
  {
    company: "Acme Corp",
    role: "Senior Frontend Engineer",
    period: "2022 – Present",
    description:
      "Led migration to Next.js and design system. Improved Core Web Vitals and accessibility across product surfaces.",
    tags: ["React", "Next.js", "TypeScript", "Design Systems"],
  },
  {
    company: "Startup Inc",
    role: "Frontend Developer",
    period: "2020 – 2022",
    description:
      "Built customer-facing dashboards and internal tools. Introduced Storybook and component documentation.",
    tags: ["React", "Storybook", "REST APIs"],
  },
  {
    company: "Agency Ltd",
    role: "Junior Developer",
    period: "2018 – 2020",
    description: "Developed marketing sites and landing pages. Collaborated with design on responsive layouts.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export const Default: Story = {
  args: { items: mockItems },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        company: "Solo Co",
        role: "Full Stack Developer",
        period: "2023 – Present",
        description: "Sole developer on a greenfield product. Built API, frontend, and deployment pipeline.",
        tags: ["Node.js", "React", "PostgreSQL", "AWS"],
      },
    ],
  },
};
