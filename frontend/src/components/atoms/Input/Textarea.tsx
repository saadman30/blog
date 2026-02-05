import type { TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

import styles from "./Textarea.module.scss";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return <textarea className={clsx(styles.textarea, className)} {...props} />;
};

export default Textarea;
