"use client";

import React, { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMap } from "./map";
import ContextMenu from "./ContextMenu";
import useContextMenu from "./contextMenu";
import useLocationHighlight from "./locationHighlight";
import useLocationSelector from "./locationSelector";

import styles from "./Map.module.css";
import useSelectedWayHighlight from "./selectedWayHighlight";

export default function Map(): React.JSX.Element {
  const container = useRef<HTMLDivElement>(null);
  const map = useMap(container);
  const onClick = useContextMenu(map);
  useLocationHighlight(map);
  useLocationSelector(map);
  useSelectedWayHighlight(map);
  return (
    <div className={styles.root}>
      <div className={styles.map} ref={container} />
      <ContextMenu onClick={onClick} />
    </div>
  );
}
