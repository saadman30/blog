import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Flex.module.scss";

/** HTML container tags supported by Flex (div-like props only; excludes SVG) */
const FLEX_AS_TAGS = [
  "div",
  "section",
  "article",
  "main",
  "header",
  "footer",
  "nav",
  "aside",
  "span",
  "form",
] as const;
export type FlexAsTag = (typeof FLEX_AS_TAGS)[number];

export type FlexDirection = "row" | "column" | "rowReverse" | "columnReverse";
export type FlexJustify =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around";
export type FlexAlign =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline";
export type FlexGap = "xs" | "sm" | "md" | "lg" | "xl";

export interface FlexProps {
  children: ReactNode;
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: boolean | "wrap" | "nowrap";
  gap?: FlexGap;
  as?: FlexAsTag;
  id?: string;
  "aria-label"?: string;
}

const Flex = ({
  children,
  direction = "row",
  justify,
  align,
  wrap,
  gap,
  as: Component = "div",
  ...rest
}: FlexProps &
  Omit<HTMLAttributes<HTMLElement>, keyof FlexProps | "className">) => {
  const wrapClass =
    wrap === true
      ? styles.rootWrap
      : wrap === false
        ? styles.rootNowrap
        : wrap === "wrap"
          ? styles.rootWrap
          : wrap === "nowrap"
            ? styles.rootNowrap
            : undefined;

  const justifyClass =
    justify != null
      ? styles[`root--justify${justify.charAt(0).toUpperCase()}${justify.slice(1)}` as keyof typeof styles]
      : undefined;
  const alignClass =
    align != null
      ? styles[`root--align${align.charAt(0).toUpperCase()}${align.slice(1)}` as keyof typeof styles]
      : undefined;
  const gapClass =
    gap != null
      ? styles[`root--gap${gap.charAt(0).toUpperCase()}${gap.slice(1)}` as keyof typeof styles]
      : undefined;

  const classNames = clsx(
    styles.root,
    styles[`root--${direction}` as keyof typeof styles],
    justifyClass,
    alignClass,
    wrapClass,
    gapClass
  );

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default Flex;
