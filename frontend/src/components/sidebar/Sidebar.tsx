import React, { useState } from "react";

import { CloseButton, Paper } from "@mantine/core";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
} from "@phosphor-icons/react";
import cx from "clsx";

import styles from "./Sidebar.module.css";
import SidebarContext from "./context";

type Props = {
  children: React.ReactNode;
  // Callback when user clicks close button. The button is not shown if not set.
  onClose?: () => void;
  /** Should the full height be used, even on mobile? */
  fullHeight?: boolean;
};

export default function Sidebar({ children, onClose, fullHeight }: Props) {
  const [folded, setFolded] = useState(false);
  return (
    <SidebarContext.Provider value={{ folded }}>
      <div
        className={cx(styles.root, {
          [styles.folded]: folded,
          [styles.fullHeight]: !folded && fullHeight,
        })}
      >
        <Paper shadow="lg" h="100%" withBorder radius={0}>
          <div className={styles.close}>
            <CloseButton size="xl" onClick={onClose} />
          </div>
          <div className={styles.toggle}>
            <button onClick={() => setFolded((old: boolean) => !old)}>
              {folded ? (
                <div className={styles.caretVariants}>
                  <CaretRight size="25" weight="fill" />
                  <CaretUp size="25" weight="fill" />
                </div>
              ) : (
                <div className={styles.caretVariants}>
                  <CaretLeft size="25" weight="fill" />
                  <CaretDown size="25" weight="fill" />
                </div>
              )}
            </button>
          </div>
          <div className={styles.inner}>{children}</div>
        </Paper>
      </div>
    </SidebarContext.Provider>
  );
}
