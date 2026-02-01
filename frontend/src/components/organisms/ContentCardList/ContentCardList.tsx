import type { ReactElement, ReactNode } from "react";
import { Children } from "react";

import styles from "./ContentCardList.module.scss";

export interface ContentCardListProps {
  /** ContentCard (or other) children; list handles layout and list structure */
  children: ReactNode;
}

const ContentCardList = ({ children }: ContentCardListProps) => (
  <ul className={styles.list} role="list">
    {Children.map(children, (child, index) =>
      child != null ? (
        <li key={(child as ReactElement)?.key ?? index}>{child}</li>
      ) : null
    )}
  </ul>
);

export default ContentCardList;
