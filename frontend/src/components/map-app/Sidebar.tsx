import React, { useState } from "react";

import { CloseButton, Flex, Paper } from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import cx from "clsx";

import styles from "./Sidebar.module.css";

type Props = {
  children: React.ReactNode;

  // Callback when user clicks close button. The button is not shown if not set.
  onClose?: () => void;
};

export default function Sidebar({ children, onClose }: Props) {
  const [folded, setFolded] = useState(false);
  return (
    <div className={cx(styles.root, { [styles.folded]: folded })}>
      <Paper shadow="lg" h="100%" withBorder radius={0}>
        <div className={styles.close}>
          <CloseButton size="xl" onClick={onClose} />
        </div>
        <div className={styles.toggle}>
          <button onClick={() => setFolded((old: boolean) => !old)}>
            {folded ? (
              <CaretRight size="25" weight="fill" />
            ) : (
              <CaretLeft size="25" weight="fill" />
            )}
          </button>
        </div>
        <div className={styles.inner}>{children}</div>
      </Paper>
    </div>
  );
}
