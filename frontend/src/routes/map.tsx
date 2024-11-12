"use client";

import { useEffect, useState } from "react";
import styles from "./map.module.css";
import MapApp from "@/components/map-app";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  centerUpdated,
  selectMapState,
  zoomUpdated,
} from "@/features/map/mapSlice";
import useMapSearchParams from "@/hooks/useMapSearchParams";
import useMeta from "@/hooks/useMeta";

export default function Map() {
  useMeta({ title: "" });
  const { wayId } = useParams();

  let [searchParams, setSearchParams] = useSearchParams();
  const mapSearchParams = useMapSearchParams();

  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);

  useEffect(() => {
    setSearchParams((_) => mapSearchParams, { replace: true });
  }, [mapState]);

  // Set map zoom and center based on URL params.
  useEffect(() => {
    const centerCoords = searchParams.get("c")
      ? searchParams.get("c")!.split(",").map(parseFloat)
      : [];
    const center: [number, number] | null =
      centerCoords.length === 2 && !centerCoords.some(isNaN)
        ? [centerCoords[0], centerCoords[1]]
        : null;
    const zoom: number | null = searchParams.get("z")
      ? parseFloat(searchParams.get("z") as string)
      : null;

    if (zoom) {
      dispatch(zoomUpdated(zoom));
    }
    if (center) {
      dispatch(centerUpdated({ lng: center[0], lat: center[1] }));
    }
  }, []);

  return (
    <main className={styles.root}>
      <MapApp selectedWay={wayId ? parseInt(wayId) : null}></MapApp>
    </main>
  );
}
