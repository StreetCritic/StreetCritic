"use client";

import React, { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMapState,
  centerUpdated,
  zoomUpdated,
} from "@/features/map/mapSlice";

import { useMap, WaySelectHandler } from "./map";

import styles from "./Map.module.css";
import { useUser } from "@/hooks";

type Props = {
  route: GeoJSON.GeoJSON | null;
  onWaySelect: WaySelectHandler;
  selectedWay: number | null;
};

export default function Map(mapOptions: Props): React.JSX.Element {
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
