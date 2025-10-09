"use client";

import React, { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMap } from "./map";
import ContextMenu from "./ContextMenu";
import useContextMenu from "./contextMenu";
import useLocationHighlight from "./locationHighlight";
import useVisibleLayers from "./visibleLayers";
import useRouteDragging from "./features/routeDragging";
import useLocationSelector from "./locationSelector";

import styles from "./Map.module.css";
import useSelectedWayHighlight from "./selectedWayHighlight";
import { AnnouncementBanner } from "@/components";

export default function Map(): React.JSX.Element {
  const container = useRef<HTMLDivElement>(null);
  const [map, mapRendered] = useMap(container);
  const onClick = useContextMenu(map);
  useLocationHighlight(mapRendered ? map : null);
  useSelectedWayHighlight(mapRendered ? map : null);
  useVisibleLayers(mapRendered ? map : null);
  useRouteDragging(mapRendered ? map : null);
  useLocationSelector(mapRendered ? map : null);
  return (
    <div className={styles.root}>
      <AnnouncementBanner />
      <div className={styles.map} ref={container} />
      <ContextMenu onClick={onClick} />
    </div>
  );
}
