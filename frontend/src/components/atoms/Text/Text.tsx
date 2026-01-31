import type { ReactNode } from "react";

import styles from "./Text.module.scss";

export type TextColor = "default" | "muted" | "primary" | "accent";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";

const sizeMap: Record<TextSize, string> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  "2xl": styles.size2xl,
};

const colorMap: Record<TextColor, string> = {
  default: styles.colorDefault,
  muted: styles.colorMuted,
  primary: styles.colorPrimary,
  accent: styles.colorAccent,
};

const weightMap: Record<TextWeight, string> = {
  normal: styles.weightNormal,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

export interface TextProps {
  children: ReactNode;
  /** Text color from design tokens */
  color?: TextColor;
  /** Font size from design scale */
  size?: TextSize;
  /** Font weight */
  weight?: TextWeight;
  /** Italic text */
  italic?: boolean;
  /** Uppercase with letter-spacing (eyebrow style) */
  uppercase?: boolean;
  /** Rendered element */
  as?: "p" | "span" | "div";
}

const Text = ({
  children,
  color = "default",
  size = "md",
  weight = "normal",
  italic = false,
  uppercase = false,
  as: Tag = "p",
}: TextProps) => {
  const composed = [
    styles.root,
    sizeMap[size],
    colorMap[color],
    weightMap[weight],
    italic ? styles.italic : undefined,
    uppercase ? styles.uppercase : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={composed}>{children}</Tag>;
};

export default Text;
