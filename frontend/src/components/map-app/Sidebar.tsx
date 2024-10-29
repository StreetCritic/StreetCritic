import React from "react";

import { Paper } from "@mantine/core";

import styles from "./Sidebar.module.css";

type Props = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: Props) {
  return (
    <div className={styles.root}>
      <Paper shadow="lg" p="xl" h="100%" withBorder radius={0}>
        {children}
      </Paper>
    </div>
  );
}
