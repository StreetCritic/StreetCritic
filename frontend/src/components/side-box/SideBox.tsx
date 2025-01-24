import { Box, CloseButton, Paper } from "@mantine/core";
import styles from "./SideBox.module.css";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export default function SideBox({ children, onClose }: Props) {
  return (
    <Box className={styles.root}>
      <Paper shadow="lg" h="100%" withBorder radius={0}>
        <div className={styles.close}>
          <CloseButton size="xl" onClick={onClose} />
        </div>
        {children}
      </Paper>
    </Box>
  );
}
