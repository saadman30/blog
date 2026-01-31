import type { ElementType, ReactNode } from "react";

import styles from "./Section.module.scss";

export type SectionVariant =
  | "default"
  | "grid"
  | "content"
  | "stack"
  | "intro"
  | "article";

export interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Element to render as (e.g. "section", "article"). Default: "section" */
  as?: ElementType;
  /** Accessible label for the section (maps to aria-label) */
  ariaLabel?: string;
  /** ID of the element that labels the section (maps to aria-labelledby) */
  ariaLabelledBy?: string;
  /** Layout variant: default (none), grid, content (prose), stack (flex column), intro (tight column), article (grid, xl gap) */
  variant?: SectionVariant;
}

const Section = ({
  children,
  id,
  as: Component = "section",
  ariaLabel,
  ariaLabelledBy,
  variant = "default",
}: SectionProps) => {
  const variantClass =
    variant === "grid"
      ? styles.grid
      : variant === "content"
        ? styles.content
        : variant === "stack"
          ? styles.stack
          : variant === "intro"
            ? styles.intro
            : variant === "article"
              ? styles.article
              : undefined;

  const composed = [styles.root, variantClass].filter(Boolean).join(" ");

  return (
    <Component
      className={composed}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
};

export default Section;
