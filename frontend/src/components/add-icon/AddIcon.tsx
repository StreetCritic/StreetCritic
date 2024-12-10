import styles from "./AddIcon.module.css";
import { MapPinPlus } from "@phosphor-icons/react";

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
        <MapPinPlus size={32} weight="fill" />
      </a>
    </div>
  );
}
