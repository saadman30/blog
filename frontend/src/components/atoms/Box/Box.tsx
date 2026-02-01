import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Box.module.scss";

/** Max-width variant: constrains content width for readability or layout. */
export type BoxMaxWidth = "prose" | "content" | "wide" | "narrow" | "full";

export interface BoxProps {
  children: ReactNode;
  /** Max-width variant. "full" = no constraint. Default: "full". */
  maxWidth?: BoxMaxWidth;
  /** Min-width 0 for grid/flex children so they can shrink. Default: false. */
  minWidth0?: boolean;
  /** Element to render as (e.g. "div", "article", "aside"). Default: "div". */
  as?: ElementType;
}

const Box = ({
  children,
  maxWidth = "full",
  minWidth0 = false,
  as: Component = "div",
  ...rest
}: BoxProps & Omit<HTMLAttributes<HTMLElement>, keyof BoxProps | "className">) => {
  const maxWidthClass =
    maxWidth === "full"
      ? undefined
      : (styles[`root--${maxWidth}` as keyof typeof styles] as string);

  const classNames = clsx(
    styles.root,
    maxWidthClass,
    minWidth0 && styles.rootMinWidth0
  );

  return <Component className={classNames} {...rest}>{children}</Component>;
};

export default Box;
