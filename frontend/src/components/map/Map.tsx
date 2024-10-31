"use client";

import React, { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LngLatLike } from "maplibre-gl";
import { Route } from "ibre";
import { Point } from "@/hooks/useRoute";
import { LngLat } from "maplibre-gl";

import {
  useMap,
  WaySelectHandler,
  PositionHandler,
  PositionChangeHandler,
  MapOptions,
} from "./map";

import styles from "./Map.module.css";

export default function Map(mapOptions: MapOptions): React.JSX.Element {
  const container = useRef<HTMLDivElement>(null);
  useMap(container, mapOptions);
  return (
    <div className={styles.root}>
      <div className={styles.map} ref={container} />
    </div>
  );
}

/* <div className={styles.debug} id="debug">
 *   <div id="debug-coords" />
 *   <div id="debug-id" />
 *   <a href="" id="download">download</a>
 * </div> */
