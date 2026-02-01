import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Link from "@/components/atoms/Link";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

import styles from "./AboutTemplate.module.scss";

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface AboutTemplateProps {
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

const AboutTemplate = ({ experience, projects }: AboutTemplateProps) => {
  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <Section id="hero">
          <span className={styles.role}>Fullstack Web Developer</span>
          <Heading level="h1">
            Building Scalable &amp; Engaging Web Experiences
          </Heading>
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
            web experiences. From crafting beautiful frontends to powering
            robust backends, I bring ideas to life with clean code and great
            design.{" "}
          </Text>
          <Text as="span" size="lg" color="default" weight="medium">
            Let&apos;s create something amazing together!
          </Text>
        </p>
        <Link href="#about" variant="cta">
          See What I Do
        </Link>
        </Section>
      </div>

      {/* About */}
      <div className={styles.section}>
        <Section id="about" ariaLabelledBy="about-heading">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
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
          <Heading level="h2" id="experience-heading">
            Professional Journey
          </Heading>
          <Text color="muted" size="sm" as="p">
            A timeline of my professional growth and key achievements
          </Text>
          <ul className={styles.timeline}>
          {experience.map((item, i) => (
            <li key={i} className={styles.timelineItem}>
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
            </li>
          ))}
          </ul>
        </Section>
      </div>

      {/* Projects */}
      <div className={styles.section}>
        <Section id="projects" ariaLabelledBy="projects-heading">
          <Heading level="h2" id="projects-heading">
            Featured Work
          </Heading>
          <Text color="muted" size="sm" as="p">
            Showcasing some of my best projects and technical achievements
          </Text>
          <ul className={styles.projectGrid}>
            {projects.map((project, i) => (
              <li key={i} className={styles.projectCard}>
                <div className={styles.projectImage} aria-hidden>
                  <div className={styles.imagePlaceholder} />
                </div>
                <div className={styles.projectBody}>
                  <Heading level="h3">{project.title}</Heading>
                  <Text color="muted" size="sm" as="p">
                    {project.description}
                  </Text>
                  <ul className={styles.tagList} role="list">
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.projectActions}>
                    <Link
                      href={project.liveUrl}
                      variant="inline"
                      external={project.liveUrl.startsWith("http")}
                    >
                      Live Demo
                    </Link>
                    <Link
                      href={project.githubUrl}
                      variant="inline"
                      external={project.githubUrl.startsWith("http")}
                    >
                      View Code
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
};

export default AboutTemplate;
