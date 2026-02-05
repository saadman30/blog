import type { ElementType, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Section.module.scss";

/** Spacing variant: controls padding (and optionally margin) around the section. Layout use Flex; gap use Flex or Spacing. */
export type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";

/** Visual/layout variants for Section. */
export type SectionVariant = "default" | "stacked" | "card";

export interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Element to render as (e.g. "section", "article"). Default: "section" */
  as?: ElementType;
  /** Accessible label for the section (maps to aria-label) */
  ariaLabel?: string;
  /** ID of the element that labels the section (maps to aria-labelledby) */
  ariaLabelledBy?: string;
  /** Spacing variant: padding (and margin) around the section. For layout use Flex inside; for gap use Flex or Spacing. */
  spacing?: SectionSpacing;
  /** When true, adds top border and larger block padding (for separated content blocks). Ignores spacing when set. */
  divider?: boolean;
  /** Layout/visual variant. "stacked" applies a vertical flex stack with a generous row gap. "card" applies card-like styling with border, background, and padding. */
  variant?: SectionVariant;
}

const Section = ({
  children,
  id,
  as: Component = "section",
  ariaLabel,
  ariaLabelledBy,
  spacing = "md",
  divider = false,
  variant = "default",
}: SectionProps) => {
  const spacingClass = divider
    ? styles.divider
    : spacing === "none"
      ? styles.spacingNone
      : spacing === "sm"
        ? styles.spacingSm
        : spacing === "lg"
          ? styles.spacingLg
          : spacing === "xl"
            ? styles.spacingXl
            : styles.spacingMd;

  const variantClass =
    variant === "stacked"
      ? styles.variantStacked
      : variant === "card"
        ? styles.variantCard
        : undefined;

  const composed = clsx(styles.root, spacingClass, variantClass);

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
