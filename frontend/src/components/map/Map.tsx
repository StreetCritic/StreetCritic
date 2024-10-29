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
} from "./map";

import styles from "./Map.module.css";

type Props = {
  // URL of the MapLibre style.
  styleURL: string;
  // Initial center point.
  center: LngLatLike;
  // URL to the Valhalla instance.
  /* valhallaURL: string; */
  stops: Point[];
  route: Route | null;
  onPosition: PositionHandler;
  onPositionChange: PositionChangeHandler;
  onRoutePosition: PositionHandler;
  onWaySelect: WaySelectHandler;
  APIToken: string | null;
  selectedWay: number | null;
};

export default function Map({
  styleURL,
  center,
  stops,
  route,
  onPosition,
  onPositionChange,
  onRoutePosition,
  onWaySelect,
  APIToken,
  selectedWay,
}: Props): React.JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  useMap(
    mapContainer,
    styleURL,
    center,
    stops,
    route,
    onPosition,
    onPositionChange,
    onRoutePosition,
    onWaySelect,
    APIToken,
    selectedWay,
  );
  return (
    <div className={styles.root}>
      <div className={styles.map} ref={mapContainer} />
    </div>
  );
}

/* <div className={styles.debug} id="debug">
 *   <div id="debug-coords" />
 *   <div id="debug-id" />
 *   <a href="" id="download">download</a>
 * </div> */
