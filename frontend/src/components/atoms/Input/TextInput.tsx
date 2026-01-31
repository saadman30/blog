import type { InputHTMLAttributes, ReactNode } from "react";

import styles from "./TextInput.module.scss";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  leadingIcon?: ReactNode;
}

const TextInput = ({ leadingIcon, ...props }: TextInputProps) => {
  return (
    <div className={styles.inputWrapper}>
      {leadingIcon ? <span className={styles.leadingIcon}>{leadingIcon}</span> : null}
      <input className={styles.input} {...props} />
    </div>
  );
};

export default TextInput;

