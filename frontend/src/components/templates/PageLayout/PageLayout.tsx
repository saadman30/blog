import type { ReactNode } from "react";

import styles from "./PageLayout.module.scss";

export type PageLayoutVariant = "narrow" | "wide";

export interface PageLayoutProps {
  children: ReactNode;
  /** Narrow (960px) for content pages like blog; wide (72rem) for marketing. */
  variant?: PageLayoutVariant;
}

const PageLayout = ({ children, variant = "narrow" }: PageLayoutProps) => {
  const variantClass =
    variant === "wide" ? styles.wide : styles.narrow;
  const composed = [styles.root, variantClass].join(" ");

  return <div className={composed}>{children}</div>;
};

export default PageLayout;
