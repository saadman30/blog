import Link from "next/link";

import Text from "@/components/atoms/Text";
import Heading from "@/components/atoms/Heading";
import Section from "@/components/atoms/Section";
import styles from "@/styles/home.module.scss";

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
  {
    company: "WebTech Studios",
    role: "Frontend Developer",
    period: "2018 - 2019",
    description:
      "Created responsive and interactive user interfaces, collaborated with designers, and optimized application performance.",
    tags: ["React", "JavaScript", "SASS", "Webpack", "Jest"],
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
    <main className={styles.home}>
      {/* Hero */}
      <div className={styles.hero}>
        <Section id="hero">
          <span className={styles.role}>Fullstack Web Developer</span>
          <div className={styles.headline}>
            <Heading level="h1">
              Building Scalable &amp; Engaging Web Experiences
            </Heading>
          </div>
        <p className={styles.intro}>
          <Text as="span" size="lg" color="muted" weight="bold">
            Hey there!{" "}
          </Text>
          <Text as="span" size="lg" color="muted">
            I&apos;m a{" "}
          </Text>
          <Text as="span" size="lg" color="primary" weight="semibold">
            Full Stack Developer
          </Text>
          <Text as="span" size="lg" color="muted">
            {" "}
            who loves building{" "}
          </Text>
          <Text as="span" size="lg" color="accent" italic>
            cool and scalable
          </Text>
          <Text as="span" size="lg" color="muted">
            {" "}
            web experiences. From crafting beautiful frontends to powering robust
            backends, I bring ideas to life with clean code and great design.{" "}
          </Text>
          <Text as="span" size="lg" color="default" weight="medium">
            Let&apos;s create something amazing together!
          </Text>
        </p>
        <Link href="#about" className={styles.cta}>
          See What I Do
        </Link>
        </Section>
      </div>

      {/* About */}
      <div className={styles.section}>
        <Section id="about" ariaLabelledBy="about-heading">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <div className={styles.sectionTitle}>
                <Heading level="h2" id="about-heading">
                  Passionate about creating impactful web experiences
                </Heading>
              </div>
              <div className={styles.sectionLead}>
                <Text color="muted" size="md">
              With over 5 years of experience in full-stack development, I
              specialize in building scalable web applications using modern
              technologies. My expertise includes React, Node.js, and cloud
              architecture. I&apos;m passionate about creating elegant solutions
              to complex problems and sharing knowledge with the developer
              community.
                </Text>
              </div>
              <div className={styles.aboutActions}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                GitHub
              </a>
              <a href="/cv.pdf" download className={styles.linkButton}>
                Download CV
              </a>
              </div>
            </div>
            <div className={styles.aboutImage} aria-hidden>
              <div className={styles.imagePlaceholder} />
            </div>
          </div>
        </Section>
      </div>

      {/* Experience */}
      <div className={styles.section}>
        <Section id="experience" ariaLabelledBy="experience-heading">
          <div className={styles.sectionTitle}>
            <Heading level="h2" id="experience-heading">
              Professional Journey
            </Heading>
          </div>
          <div className={styles.sectionSubtitle}>
            <Text color="muted" size="sm">
              A timeline of my professional growth and key achievements
            </Text>
          </div>
          <ul className={styles.timeline}>
            {experience.map((item, i) => (
              <li key={i} className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineCompany}>
                    <Text
                      color="muted"
                      size="xs"
                      weight="semibold"
                      as="p"
                    >
                      {item.company}
                    </Text>
                  </div>
                  <div className={styles.timelineRole}>
                    <Heading level="h3">{item.role}</Heading>
                  </div>
                  <div className={styles.timelinePeriod}>
                    <Text color="muted" size="xs" as="p">
                      {item.period}
                    </Text>
                  </div>
                  <div className={styles.timelineDescription}>
                    <Text color="muted" size="sm" as="p">
                      {item.description}
                    </Text>
                  </div>
                  <ul className={styles.tagList} role="list">
                    {item.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Projects */}
      <div className={styles.section}>
        <Section id="projects" ariaLabelledBy="projects-heading">
          <div className={styles.sectionTitle}>
            <Heading level="h2" id="projects-heading">
              Featured Work
            </Heading>
          </div>
          <div className={styles.sectionSubtitle}>
            <Text color="muted" size="sm">
              Showcasing some of my best projects and technical achievements
            </Text>
          </div>
          <ul className={styles.projectGrid}>
            {projects.map((project, i) => (
              <li key={i} className={styles.projectCard}>
                <div className={styles.projectImage} aria-hidden>
                  <div className={styles.imagePlaceholder} />
                </div>
                <div className={styles.projectBody}>
                  <div className={styles.projectTitle}>
                    <Heading level="h3">{project.title}</Heading>
                  </div>
                  <div className={styles.projectDescription}>
                    <Text color="muted" size="sm" as="p">
                      {project.description}
                    </Text>
                  </div>
                  <ul className={styles.tagList} role="list">
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.projectActions}>
                    <a
                      href={project.liveUrl}
                      className={styles.projectLink}
                      target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                      rel={project.liveUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      className={styles.projectLink}
                      target={project.githubUrl.startsWith("http") ? "_blank" : undefined}
                      rel={project.githubUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      View Code
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </main>
  );
}
