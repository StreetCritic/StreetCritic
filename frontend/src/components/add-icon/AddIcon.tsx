import styles from "./AddIcon.module.css";
import { Plus } from "@phosphor-icons/react";

type Props = {};

/**
 * Control to switch between profiles (bicycle, foot, ...).
 */
export default function AddIcon({}: Props) {
  return (
    <div className={styles.root}>
      <a href="#">
        <Plus size={32} weight="bold" />
      </a>
    </div>
  );
}
