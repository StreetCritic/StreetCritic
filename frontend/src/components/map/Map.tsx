"use client";

import React, { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMap } from "./map";

import styles from "./Map.module.css";

type Props = {
  route: GeoJSON.GeoJSON | null;
  selectedWay: number | null;
};

export default function Map(mapOptions: Props): React.JSX.Element {
  const container = useRef<HTMLDivElement>(null);

  useMap(container, {
    ...mapOptions,
  });

  return (
    <div className={styles.root}>
      <div className={styles.map} ref={container} />
    </div>
  );
}
