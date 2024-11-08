import { Button as MantineButton, rem } from "@mantine/core";
import {
  PersonSimpleBike,
  PersonSimpleWalk,
} from "@phosphor-icons/react/dist/ssr";
import IconButton from "./IconButton";
import styles from "./ProfileControl.module.css";

type Props = {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
};

/**
 * Control to switch between profiles (bicycle, foot, ...).
 */
export default function ProfileControl({ onClick, label, icon }: Props) {
  return (
    <div className={styles.root}>
      <a href="#">
        <IconButton icon={<PersonSimpleBike size={24} />} active={true} />
      </a>
      <a href="#">
        <IconButton icon={<PersonSimpleWalk size={24} />} active={false} />
      </a>
    </div>
  );
}
