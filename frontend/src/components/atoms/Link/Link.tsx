import type { ComponentPropsWithoutRef, ReactNode } from "react";
import React from "react";
import NextLink from "next/link";
import { clsx } from "clsx";

import styles from "./Link.module.scss";

export type LinkVariant =
  | "brand"
  | "nav"
  | "cta"
  | "button"
  | "inline"
  | "cardTitle";

export interface LinkProps
  extends Omit<
    ComponentPropsWithoutRef<typeof NextLink>,
    "className" | "children"
  > {
  /** Visual style variant */
  variant?: LinkVariant;
  /** When true, opens in new tab with rel="noopener noreferrer" */
  external?: boolean;
  /** Child content */
  children: ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { href, variant = "inline", external, children, ...props },
    ref
  ) => {
    const isExternal =
      external === true ||
      (typeof href === "string" && (href.startsWith("http") || href.startsWith("//")));

    const variantClass =
      variant === "brand"
        ? styles.brand
        : variant === "nav"
          ? styles.nav
          : variant === "cta"
            ? styles.cta
            : variant === "button"
              ? styles.button
              : variant === "cardTitle"
                ? styles.cardTitle
                : styles.inline;

    const composedClassName = clsx(styles.root, variantClass);

    const linkProps = {
      ...props,
      ref,
      href,
      className: composedClassName,
      ...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    };

    return <NextLink {...linkProps}>{children}</NextLink>;
  }
);

Link.displayName = "Link";

export default Link;
