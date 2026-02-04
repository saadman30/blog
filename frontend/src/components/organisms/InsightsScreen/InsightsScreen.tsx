import type { PostInsight } from "@/lib/types";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Link from "@/components/atoms/Link";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

import styles from "./InsightsScreen.module.scss";

export interface InsightsScreenProps {
  insights: PostInsight[];
}

const InsightsScreen = ({ insights }: InsightsScreenProps) => {
  return (
    <Section as="section" spacing="lg" ariaLabel="Writing insights">
      <div className={styles.root}>
        <header className={styles.header}>
          <Heading level="h1">Insights</Heading>
          <Text as="p" size="sm" color="muted">
            Only the signals that matter, each paired with a clear action. No
            dashboards, just decisions.
          </Text>
        </header>

        <div className={styles.grid}>
          {insights.map((insight) => (
            <article key={insight.id} className={styles.card}>
              <Heading level="h2">{insight.title}</Heading>
              <Text as="p" size="sm" color="muted">
                {insight.description}
              </Text>

              {insight.posts.length > 0 && (
                <ul className={styles.list}>
                  {insight.posts.map((post) => (
                    <li key={post.id} className={styles.listItem}>
                      <div className={styles.postMeta}>
                        <Text as="p" size="sm" weight="medium">
                          {post.title}
                        </Text>
                        <Text as="span" size="xs" color="muted">
                          {post.viewsLast30Days.toLocaleString()} views ·{" "}
                          {Math.round(post.clickThroughRate * 100)}% CTR
                        </Text>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Flex as="footer" justify="end">
                <Link
                  href={insight.action.href}
                  variant="button"
                >
                  {insight.action.label}
                </Link>
              </Flex>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default InsightsScreen;

