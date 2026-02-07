import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Box.module.scss";

/** Max-width variant: constrains content width for readability or layout. */
export type BoxMaxWidth = "prose" | "content" | "wide" | "narrow" | "full";

/** Flex variant for use inside flex containers. "grow" = take remaining space (flex: 1 1 0, min-width: 0). "none" = don't grow or shrink (flex: 0 0 auto). */
export type BoxFlex = "grow" | "none";

export interface BoxProps {
  children: ReactNode;
  /** Max-width variant. "full" = no constraint. Default: "full". */
  maxWidth?: BoxMaxWidth;
  /** Min-width 0 for grid/flex children so they can shrink. Default: false. */
  minWidth0?: boolean;
  /** Flex variant when used inside a flex container. Default: undefined. */
  flex?: BoxFlex;
  /** Element to render as (e.g. "div", "article", "aside"). Default: "div". */
  as?: ElementType;
}

const Box = ({
  children,
  maxWidth = "full",
  minWidth0 = false,
  flex,
  as: Component = "div",
  ...rest
}: BoxProps & Omit<HTMLAttributes<HTMLElement>, keyof BoxProps | "className">) => {
  const maxWidthClass =
    maxWidth === "full"
      ? undefined
      : (styles[`root--${maxWidth}` as keyof typeof styles] as string);

  const flexClass =
    flex != null
      ? (styles[`root--flex${flex.charAt(0).toUpperCase()}${flex.slice(1)}` as keyof typeof styles] as string)
      : undefined;

  const classNames = clsx(
    styles.root,
    maxWidthClass,
    minWidth0 && styles.rootMinWidth0,
    flexClass
  );

  return <Component className={classNames} {...rest}>{children}</Component>;
};

export default Box;
