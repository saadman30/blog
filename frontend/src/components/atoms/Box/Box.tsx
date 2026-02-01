import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Box.module.scss";

/** Max-width variant: constrains content width for readability or layout. */
export type BoxMaxWidth = "prose" | "content" | "wide" | "narrow" | "full";

export interface BoxProps {
  children: ReactNode;
  /** Max-width variant. "full" = no constraint. Default: "full". */
  maxWidth?: BoxMaxWidth;
  /** Element to render as (e.g. "div", "article", "aside"). Default: "div". */
  as?: ElementType;
}

const Box = ({
  children,
  maxWidth = "full",
  as: Component = "div",
  ...rest
}: BoxProps & Omit<HTMLAttributes<HTMLElement>, keyof BoxProps | "className">) => {
  const maxWidthClass =
    maxWidth === "full"
      ? undefined
      : (styles[`root--${maxWidth}` as keyof typeof styles] as string);

  const classNames = clsx(styles.root, maxWidthClass);

  return <Component className={classNames} {...rest}>{children}</Component>;
};

export default Box;
