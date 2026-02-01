import PageLayout from "@/components/templates/PageLayout";
import Link from "@/components/atoms/Link";
import Box from "@/components/atoms/Box";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Image from "@/components/atoms/Image";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";
import ContentCard from "@/components/organisms/ContentCard";
import ContentCardList from "@/components/organisms/ContentCardList";
import ExperienceTimeline, {
  type ExperienceItem,
} from "@/components/organisms/ExperienceTimeline";

interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

const experience: ExperienceItem[] = [
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
  {
    company: "WebTech Studios",
    role: "Frontend Developer",
    period: "2018 - 2019",
    description:
      "Created responsive and interactive user interfaces, collaborated with designers, and optimized application performance.",
    tags: ["React", "JavaScript", "SASS", "Webpack", "Jest"],
  },
];

const projects: ProjectItem[] = [
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
  {
    title: "Real-time Chat Application",
    description:
      "Feature-rich chat application with real-time messaging, file sharing, and video calls.",
    tags: ["React", "Socket.io", "WebRTC", "Node.js", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "AI Image Generator",
    description:
      "An AI image generator that uses a model to generate images based on a prompt.",
    tags: ["React", "Next.js", "Tailwind CSS", "Shadcn UI"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const metadata = {
  title: "About • Minimalist Studio",
  description:
    "Full Stack Developer building scalable web experiences. Experience, projects, and more.",
};

export default function AboutPage() {
  return (
    <PageLayout variant="wide">
      {/* Hero */}
      <Section id="hero" spacing="xl">
        <Flex direction="column" gap="md">
          <Text as="span" size="sm" color="muted" weight="medium" uppercase>
            Fullstack Web Developer
          </Text>
          <Heading level="h1">
            Building Scalable &amp; Engaging Web Experiences
          </Heading>
          <Box maxWidth="prose">
            <Text as="p" size="lg" color="muted">
              <Text as="span" size="lg" color="muted" weight="bold">
                Hey there!
              </Text>
              <Text as="span" size="lg" color="muted">
                I&apos;m a
              </Text>
              <Text as="span" size="lg" color="primary" weight="semibold">
                Full Stack Developer
              </Text>
              <Text as="span" size="lg" color="muted">
                
                who loves building
              </Text>
              <Text as="span" size="lg" color="accent" italic>
                cool and scalable
              </Text>
              <Text as="span" size="lg" color="muted">
                web experiences. From crafting beautiful frontends to powering
                robust backends, I bring ideas to life with clean code and great
                design.
              </Text>
              <Text as="span" size="lg" color="default" weight="medium">
                Let&apos;s create something amazing together!
              </Text>
            </Text>
          </Box>
          <Link href="#about" variant="cta">
            See What I Do
          </Link>
        </Flex>
      </Section>

      {/* About */}
      <Section id="about" ariaLabelledBy="about-heading" divider>
        <Flex direction="row" wrap gap="xl" align="start">
          <Box as="div" minWidth0>
            <Heading level="h2" id="about-heading">
              Passionate about creating impactful web experiences
            </Heading>
            <Text color="muted" size="md">
              With over 5 years of experience in full-stack development, I
              specialize in building scalable web applications using modern
              technologies. My expertise includes React, Node.js, and cloud
              architecture. I&apos;m passionate about creating elegant
              solutions to complex problems and sharing knowledge with the
              developer community.
            </Text>
            <Flex as="div" wrap gap="sm">
              <Link
                href="https://github.com"
                variant="button"
                external
              >
                GitHub
              </Link>
              <Link href="/cv.pdf" variant="button" download>
                Download CV
              </Link>
            </Flex>
          </Box>
          <Image
            src="/images/about.jpg"
            alt="Portrait or visual representing the developer"
            aspectRatio="square"
            sizes="(max-width: 768px) 288px, 50vw"
          />
        </Flex>
      </Section>

      {/* Experience */}
      <Section id="experience" ariaLabelledBy="experience-heading" divider>
          <Heading level="h2" id="experience-heading">
            Professional Journey
          </Heading>
          <Text color="muted" size="sm" as="p">
            A timeline of my professional growth and key achievements
          </Text>
          <ExperienceTimeline items={experience} />
        </Section>

      {/* Projects */}
      <Section id="projects" ariaLabelledBy="projects-heading" divider>
          <Heading level="h2" id="projects-heading">
            Featured Work
          </Heading>
          <Text color="muted" size="sm" as="p">
            Showcasing some of my best projects and technical achievements
          </Text>
          <ContentCardList>
            {projects.map((project) => (
              <ContentCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.tags}
                showMediaPlaceholder
                actions={[
                  {
                    label: "Live Demo",
                    href: project.liveUrl,
                    external: project.liveUrl.startsWith("http"),
                  },
                  {
                    label: "View Code",
                    href: project.githubUrl,
                    external: project.githubUrl.startsWith("http"),
                  },
                ]}
              />
            ))}
          </ContentCardList>
        </Section>
    </PageLayout>
  );
}
