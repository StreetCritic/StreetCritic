import {
  PersonSimpleBike,
  /* PersonSimpleWalk, */
} from "@phosphor-icons/react/dist/ssr";
import IconButton from "./IconButton";
import styles from "./ProfileControl.module.css";

/**
 * Control to switch between profiles (bicycle, foot, ...).
 */
export default function ProfileControl() {
  return (
    <div className={styles.root}>
      <IconButton icon={<PersonSimpleBike size={24} />} active={true} />
      {/* <IconButton icon={<PersonSimpleWalk size={24} />} active={false} /> */}
    </div>
  );
}
