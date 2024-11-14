import React from "react";

import { CloseButton, Flex, Paper } from "@mantine/core";

import styles from "./Sidebar.module.css";

type Props = {
  children: React.ReactNode;

  // Callback when user clicks close button. The button is not shown if not set.
  onClose?: () => void;
};

export default function Sidebar({ children, onClose }: Props) {
  return (
    <div className={styles.root}>
      <Paper shadow="lg" p="xl" h="100%" withBorder radius={0}>
        <Flex justify="flex-end">
          <CloseButton size="xl" onClick={onClose} />
        </Flex>
        {children}
      </Paper>
    </div>
  );
}
