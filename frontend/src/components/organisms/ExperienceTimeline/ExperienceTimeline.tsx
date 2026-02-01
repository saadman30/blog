import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

import styles from "./ExperienceTimeline.module.scss";

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <ul className={styles.timeline}>
      {items.map((item, i) => (
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
  );
}
