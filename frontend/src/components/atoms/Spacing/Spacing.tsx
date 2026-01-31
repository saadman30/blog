import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

import styles from "./Spacing.module.scss";

export type SpacingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpacingProps {
  children?: ReactNode;
  /** Padding block (vertical). Use for gap-like padding around content. */
  paddingBlock?: SpacingSize;
  /** Padding inline (horizontal). */
  paddingInline?: SpacingSize;
  /** Margin block (vertical). Use for gap between sections. */
  marginBlock?: SpacingSize;
  /** Margin inline (horizontal). */
  marginInline?: SpacingSize;
  /** Shorthand: sets both paddingBlock and paddingInline. */
  padding?: SpacingSize;
  /** Shorthand: sets both marginBlock and marginInline. */
  margin?: SpacingSize;
  /** When true, renders as a spacer element (no children). Use marginBlock for vertical gap. */
  asSpacer?: boolean;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
}

const sizeToClass = (size: SpacingSize, prefix: string) =>
  styles[`${prefix}${size.charAt(0).toUpperCase()}${size.slice(1)}` as keyof typeof styles];

const Spacing = ({
  children,
  paddingBlock,
  paddingInline,
  marginBlock,
  marginInline,
  padding,
  margin,
  asSpacer = false,
  as: Component = "div",
  ...rest
}: SpacingProps &
  Omit<HTMLAttributes<HTMLElement>, keyof SpacingProps | "className">) => {
  const paddingBlockClass = (paddingBlock ?? padding) != null ? sizeToClass((paddingBlock ?? padding)!, "paddingBlock") : undefined;
  const paddingInlineClass = (paddingInline ?? padding) != null ? sizeToClass((paddingInline ?? padding)!, "paddingInline") : undefined;
  const marginBlockClass = marginBlock != null ? sizeToClass(marginBlock, "marginBlock") : undefined;
  const marginInlineClass = (marginInline ?? margin) != null ? sizeToClass((marginInline ?? margin)!, "marginInline") : undefined;

  const classNames = clsx(
    paddingBlockClass,
    paddingInlineClass,
    marginBlockClass,
    marginInlineClass
  );

  if (asSpacer) {
    return <Component className={clsx(styles.spacer, marginBlockClass)} aria-hidden {...rest} />;
  }

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};

export default Spacing;
