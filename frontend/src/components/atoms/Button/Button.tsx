import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";
import { clsx } from "clsx";

import styles from "./Button.module.scss";

type Variant = "primary" | "ghost";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: Variant;
  pressed?: boolean;
  children: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", pressed, children, ...props }, ref) => {
    const variantClass =
      variant === "primary" ? styles.primary : styles.ghost;

    const composedClassName = clsx(
      styles.button,
      variantClass,
      variant === "ghost" && pressed && styles.ghostPressed
    );

    return (
      <button
        ref={ref}
        className={composedClassName}
        aria-pressed={pressed}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

