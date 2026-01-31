import Button from "../../atoms/Button";
import styles from "./PostTag.module.scss";

interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const PostTag = ({ label, active, onClick }: Props) => {
  const classes = [styles.tag, active ? styles.active : undefined]
    .filter(Boolean)
    .join(" ");
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

