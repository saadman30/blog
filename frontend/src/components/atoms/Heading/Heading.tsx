import type { ReactNode } from "react";

import styles from "./Heading.module.scss";

export type HeadingLevel = "h1" | "h2" | "h3";

export interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  id?: string;
}

const Heading = ({ level, children, id }: HeadingProps) => {
  const Tag = level;
  const levelClass =
    level === "h1" ? styles.h1 : level === "h2" ? styles.h2 : styles.h3;

  const composed = [styles.heading, levelClass].filter(Boolean).join(" ");

  return (
    <Tag className={composed} id={id}>
      {children}
    </Tag>
  );
};

export default Heading;
