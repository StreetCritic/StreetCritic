"use client";

import { useEffect, useState } from "react";
import styles from "./map.module.css";
import initIbre from "ibre";
import MapApp from "@/components/map-app";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { centerUpdated, selectMapState, zoomUpdated } from "@/features/map/mapSlice";

export default function Map() {
  const [initDone, setInitDone] = useState(false);
  const { wayId } = useParams();

  let [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);

  useEffect(() => {
    setSearchParams((oldParams) => ({
      c: `${mapState.center.lng},${mapState.center.lat}`,
      z: `${mapState.zoom}`,
    }));
  }, [mapState]);

  // Set map zoom and center based on URL params.
  useEffect(() => {
    const centerCoords = searchParams.get('c') ? searchParams.get('c')!.split(',').map(parseFloat) : [];
    const center: [number, number] | null = centerCoords.length === 2 &&
    !centerCoords.some(isNaN) ? [centerCoords[0], centerCoords[1]]
    : null;
    const zoom: number | null = searchParams.get('z') ? parseFloat(searchParams.get('z') as string) : null;

    if (zoom) {
      dispatch(zoomUpdated(zoom));
    }
    if (center) {
      dispatch(centerUpdated({ lng: center[0], lat: center[1] }));
    }
  }, []);

  useEffect(() => {
    (async () => {
      await initIbre();
      setInitDone(true);
    })();
  });

  return (
    <main className={styles.root}>
      {initDone && (
        <MapApp selectedWay={wayId ? parseInt(wayId) : null}></MapApp>
      )}
    </main>
  );
}
