"use client";

import { useEffect } from "react";
import styles from "./map.module.css";
import MapApp from "@/components/map-app";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { centerUpdated, selectMapState } from "@/features/map/mapSlice";
import useMapSearchParams from "@/hooks/useMapSearchParams";
import useMeta from "@/hooks/useMeta";
import { selectedLocation } from "@/features/map/locationSlice";

export default function Map() {
  useMeta({ title: "" });
  const { wayId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const mapSearchParams = useMapSearchParams();

  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);

  useEffect(() => {
    setSearchParams(() => mapSearchParams, { replace: true });
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const locationMarkerCoords = searchParams.get("lm")
      ? searchParams.get("lm")!.split(",").map(parseFloat)
      : [];
    const locationMarker: [number, number] | null =
      locationMarkerCoords.length === 2 && !locationMarkerCoords.some(isNaN)
        ? [locationMarkerCoords[0], locationMarkerCoords[1]]
        : null;
    const zoom: number | null = searchParams.get("z")
      ? parseFloat(searchParams.get("z") as string)
      : null;

    if (zoom) {
      dispatch(centerUpdated({ zoom, updateView: true }));
    }
    if (center) {
      dispatch(
        centerUpdated({ lng: center[0], lat: center[1], updateView: true }),
      );
    }
    if (locationMarker) {
      dispatch(
        selectedLocation({
          center: {
            lng: locationMarker[0],
            lat: locationMarker[1],
          },
          label: null,
        }),
      );
    }
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.root}>
      <MapApp selectedWay={wayId ? parseInt(wayId) : null}></MapApp>
    </main>
  );
}
