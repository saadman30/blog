import type { ElementType, ReactNode } from "react";

import styles from "./Card.module.scss";

export interface CardProps {
  children: ReactNode;
  /** Element to render as (e.g. "article", "div", "section"). Default: "div" */
  as?: ElementType;
}

const Card = ({ children, as: Component = "div" }: CardProps) => {
  return <Component className={styles.root}>{children}</Component>;
};

export default Card;
