import styles from "./AddIcon.module.css";
import { Plus } from "@phosphor-icons/react";

type Props = {
  onClick: () => void;
};

/**
 * Control to switch between profiles (bicycle, foot, ...).
 */
export default function AddIcon({ onClick }: Props) {
  return (
    <div className={styles.root}>
      <a href="#" onClick={onClick}>
        <Plus size={32} weight="bold" />
      </a>
    </div>
  );
}
