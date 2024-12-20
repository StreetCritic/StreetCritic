import { SmileySad, Smiley } from "@phosphor-icons/react";
import { ratingScale } from "./colors";
import styles from "./Legend.module.css";

/**
 * Displays the map legends.
 */
export default function Legend() {
  const scale = ratingScale();
  let inner = "";
  for (let i = 0; i <= 1.0; i = i + 0.1) {
    inner += "," + scale(i).hex();
  }
  return (
    <div className={styles.root}>
      Way rating:
      <br />
      <span>
        <SmileySad size={16} weight="bold" />
      </span>
      <i style={{ background: `linear-gradient(to right${inner})` }}></i>
      <span>
        <Smiley size={16} weight="bold" />
      </span>
      <br />
    </div>
  );
}
