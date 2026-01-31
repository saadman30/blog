import type { ReactNode } from "react";

import styles from "./Eyebrow.module.scss";

export interface EyebrowProps {
  children: ReactNode;
}

const Eyebrow = ({ children }: EyebrowProps) => {
  return <p className={styles.eyebrow}>{children}</p>;
};

export default Eyebrow;
