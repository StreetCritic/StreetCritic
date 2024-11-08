import { ReactElement } from "react";

import styles from "./IconButton.module.css";
import cn from "clsx";

type Props = {
  icon: ReactElement;
  active: boolean;
};

export default function IconButton({ icon, active }: Props) {
  return (
    <div className={cn(styles.root, { [styles.active]: active })}>{icon}</div>
  );
}
