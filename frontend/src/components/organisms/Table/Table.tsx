import type { ReactNode, TableHTMLAttributes } from "react";

import styles from "./Table.module.scss";

export interface TableProps
  extends Omit<TableHTMLAttributes<HTMLTableElement>, "className"> {
  /** Table header, typically a <tr> with <th> cells wrapped in <thead>. */
  header: ReactNode;
  /** Table body rows wrapped in <tbody>. */
  body: ReactNode;
  /** Accessible label for the table. */
  "aria-label"?: string;
}

const Table = ({ header, body, ...rest }: TableProps) => (
  <div className={styles.root}>
    <table
      className={styles.table}
      {...rest}
    >
      <thead>{header}</thead>
      <tbody>{body}</tbody>
    </table>
  </div>
);

export default Table;

