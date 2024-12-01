"use client";

import React, { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LngLatLike } from "maplibre-gl";
import { Route } from "ibre";
import { Point } from "@/hooks/useRoute";
import { LngLat } from "maplibre-gl";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMapState,
  centerUpdated,
  zoomUpdated,
} from "@/features/map/mapSlice";

import {
  useMap,
  WaySelectHandler,
  PositionHandler,
  PositionChangeHandler,
  MapOptions,
} from "./map";

import styles from "./Map.module.css";
import { useUser } from "@/hooks";

export default function Map(mapOptions: MapOptions): React.JSX.Element {
  const dispatch = useDispatch();
  const user = useUser();
  const mapState = useSelector(selectMapState);

  const container = useRef<HTMLDivElement>(null);
  useMap(container, {
    ...mapOptions,
    zoom: mapState.zoom,
    onZoomChange: (zoom) => {
      dispatch(zoomUpdated(zoom));
    },
    center: mapState.center,
    onCenterChange: (center) => {
      dispatch(centerUpdated({ lng: center.lng, lat: center.lat }));
    },
    user,
  });
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
