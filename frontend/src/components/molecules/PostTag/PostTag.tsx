import Button from "../../atoms/Button";
import styles from "./PostTag.module.scss";

interface Props {
  label: string;
  /** Filter (clickable) or static (display-only). Default: "filter" */
  variant?: "filter" | "static";
  active?: boolean;
  onClick?: () => void;
}

const PostTag = ({
  label,
  variant = "filter",
  active,
  onClick,
}: Props) => {
  const classes = [
    styles.tag,
    variant === "static" ? styles.static : undefined,
    active ? styles.active : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "static") {
    return <span className={classes}>{label}</span>;
  }

  return (
    <span className={classes}>
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        aria-pressed={active}
      >
        {label}
      </Button>
    </span>
  );
};

export default PostTag;

