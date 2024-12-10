import { Box, Tooltip } from "@mantine/core";
import styles from "./ActionIcon.module.css";

type Props = {
  icon: React.ReactNode;
  color: string;
  label: string;
  onClick: () => void;
};

/**
 * Implements an action icon.
 */
export default function ActionIcon({ onClick, icon, color, label }: Props) {
  return (
    <Tooltip label={label}>
      <Box bg={color} className={styles.root}>
        <a href="#" onClick={onClick}>
          {icon}
        </a>
      </Box>
    </Tooltip>
  );
}
