import styles from "./AddIcon.module.css";
import { Plus } from "@phosphor-icons/react";

import { useDispatch } from "react-redux";
import { switchedToWayAdding } from "@/features/map/appSlice";

type Props = {};

/**
 * Control to switch between profiles (bicycle, foot, ...).
 */
export default function AddIcon({}: Props) {
  const dispatch = useDispatch();
  return (
    <div className={styles.root}>
      <a
        href="#"
        onClick={() => {
          dispatch(switchedToWayAdding());
        }}
      >
        <Plus size={32} weight="bold" />
      </a>
    </div>
  );
}
