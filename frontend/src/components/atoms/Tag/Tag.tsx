import type { ButtonHTMLAttributes } from "react";
import React from "react";
import { clsx } from "clsx";

import styles from "./Tag.module.scss";

export interface TagProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  label: string;
  /** Filter (clickable) or static (display-only). Default: "filter" */
  variant?: "filter" | "static";
  active?: boolean;
}

const Tag = React.forwardRef<HTMLButtonElement | HTMLSpanElement, TagProps>(
  ({ label, variant = "filter", active, ...props }, ref) => {
    const classes = clsx(
      styles.tag,
      variant === "static" && styles.static,
      active && styles.active
    );

    if (variant === "static") {
      return (
        <span ref={ref as React.Ref<HTMLSpanElement>} className={classes}>
          {label}
        </span>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        aria-pressed={active}
        {...props}
      >
        {label}
      </button>
    );
  }
);

Tag.displayName = "Tag";

export default Tag;
