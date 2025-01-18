"use client";

import React, { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMap } from "./map";
import ContextMenu from "./ContextMenu";
import useContextMenu from "./contextMenu";

import styles from "./Map.module.css";

type Props = {
  selectedWay: number | null;
};

export default function Map(mapOptions: Props): React.JSX.Element {
  const container = useRef<HTMLDivElement>(null);
  const map = useMap(container, {
    ...mapOptions,
  });
  const onClick = useContextMenu(map);
  return (
    <div className={styles.root}>
      <div className={styles.map} ref={container} />
      <ContextMenu onClick={onClick} />
    </div>
  );
}
