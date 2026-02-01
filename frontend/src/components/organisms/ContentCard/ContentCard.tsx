import type { ReactNode } from "react";

import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Image from "@/components/atoms/Image";
import Link from "@/components/atoms/Link";
import Tag from "@/components/atoms/Tag";
import Text from "@/components/atoms/Text";
import TagsList from "@/components/molecules/TagsList";

import styles from "./ContentCard.module.scss";

export interface ContentCardAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface ContentCardProps {
  /** Card title */
  title: string;
  /** Short description */
  description: string;
  /** Optional list of tags/labels */
  tags?: string[];
  /** Optional media (image or custom content). Omit and set showMediaPlaceholder to render default placeholder. */
  media?: ReactNode;
  /** When true and media is omitted, shows a default placeholder in the media area. Default: false. */
  showMediaPlaceholder?: boolean;
  /** Optional action links (e.g. "Live Demo", "View Code") */
  actions?: ContentCardAction[];
}

const ContentCard = ({
  title,
  description,
  tags = [],
  media,
  showMediaPlaceholder = false,
  actions = [],
}: ContentCardProps) => {
  const hasMedia = media != null || showMediaPlaceholder;

  return (
    <Card as="article">
      {hasMedia && (
        <div className={styles.media} aria-hidden={media == null}>
          {media ?? <Image showPlaceholder aspectRatio="16/10" />}
        </div>
      )}
      <div className={styles.body}>
        <Heading level="h3">{title}</Heading>
        <div className={styles.description}>
          <Text color="muted" size="sm" as="p">
            {description}
          </Text>
        </div>
        {tags.length > 0 && (
          <div className={styles.tagList}>
            <TagsList>
              {tags.map((tag) => (
                <Tag key={tag} label={tag} variant="static" />
              ))}
            </TagsList>
          </div>
        )}
        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                variant="inline"
                external={action.external}
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentCard;
