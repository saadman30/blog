import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import PageLayout from "../PageLayout";
import AboutTemplate from "./AboutTemplate";

const experience = [
  {
    company: "TechCorp Solutions",
    role: "Senior Full Stack Developer",
    period: "2021 - Present",
    description:
      "Led the development of enterprise-scale web applications, mentored junior developers, and implemented best practices for code quality and performance optimization.",
    tags: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
  },
  {
    company: "Digital Innovations Inc",
    role: "Full Stack Developer",
    period: "2019 - 2021",
    description:
      "Developed and maintained multiple client projects, implemented responsive designs, and integrated third-party APIs for enhanced functionality.",
    tags: ["React", "Express.js", "PostgreSQL", "Docker", "Redis"],
  },
];

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "AI Task Manager",
    description:
      "Smart task management app that uses AI to categorize, prioritize, and suggest optimal task scheduling.",
    tags: ["React", "Python", "TensorFlow", "FastAPI", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

const meta = {
  title: "Templates/AboutTemplate",
  component: AboutTemplate,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    experience: { control: false },
    projects: { control: false },
  },
  decorators: [
    (Story) => (
      <PageLayout variant="wide">
        <Story />
      </PageLayout>
    ),
  ],
} satisfies Meta<typeof AboutTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { experience, projects },
};

export const Empty: Story = {
  args: { experience: [], projects: [] },
};
