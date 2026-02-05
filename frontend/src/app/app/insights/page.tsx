import type { PostInsight } from "@/lib/types";
import { api } from "@/lib/api/client";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Link from "@/components/atoms/Link";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";
import Card from "@/components/atoms/Card";
import Table from "@/components/organisms/Table";

const InsightsPage = async () => {
  const insights = await api.getInsights();

  return (
    <Section as="section" spacing="lg" ariaLabel="Writing insights">
      <Section as="header" spacing="none">
        <Heading level="h1">Insights</Heading>
        <Text as="p" size="sm" color="muted">
          Only the signals that matter, each paired with a clear action. No dashboards,
          just decisions.
        </Text>
      </Section>

      <Flex wrap gap="md">
        {insights.map((insight) => (
          <Card as="article" key={insight.id}>
            <Heading level="h2">{insight.title}</Heading>
            <Text as="p" size="sm" color="muted">
              {insight.description}
            </Text>

            {insight.posts.length > 0 && (
              <Table
                aria-label={`Posts related to ${insight.title}`}
                header={
                  <tr>
                    <th>Post</th>
                    <th>Performance</th>
                  </tr>
                }
                body={insight.posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Text as="p" size="sm" weight="medium">
                        {post.title}
                      </Text>
                    </td>
                    <td>
                      <Text as="span" size="xs" color="muted">
                        {post.viewsLast30Days.toLocaleString()} views ·{" "}
                        {Math.round(post.clickThroughRate * 100)}% CTR
                      </Text>
                    </td>
                  </tr>
                ))}
              />
            )}

            <Flex as="footer" justify="end">
              <Link href={insight.action.href} variant="button">
                {insight.action.label}
              </Link>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Section>
  );
};

export default InsightsPage;

