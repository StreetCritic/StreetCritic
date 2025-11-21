"use client";

import { useState, useEffect } from "react";
import styles from "./map.module.css";
import MapApp from "@/components/map-app";
import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  centerUpdated,
  readyToRender,
  selectMapState,
  stopAdded,
  stopsResetted,
  streetPreferenceChanged,
  waySelected,
} from "@/features/map/mapSlice";
import useMapSearchParams from "@/hooks/useMapSearchParams";
import useMeta from "@/hooks/useMeta";
import { selectedLocation } from "@/features/map/locationSlice";
import { switchedToRouting } from "@/features/map/appSlice";
import { setUseShortest } from "@/features/map/directionsSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetWayQuery } from "@/services/api";
import { toSlug } from "@/features/seo/titles";

export default function Map() {
  const { wayId } = useParams();
  const selectedWay = wayId ? parseInt(wayId) : null;

  // TODO fix includeUser. not needed, but prevents double requests
  const way = useGetWayQuery(
    selectedWay ? { id: selectedWay, includeUser: true } : skipToken,
  );

  useMeta({
    title: (way.data ? way.data.title : "") || "",
    lang: way.data ? "de" : "en",
    path: way.data
      ? `/way/${selectedWay}/${toSlug(way.data.title || "")}?lang=de`
      : undefined,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const mapSearchParams = useMapSearchParams();
  const mapState = useSelector(selectMapState);
  const [paramsRead, setParamsRead] = useState(false);

  const dispatch = useDispatch();

  // Set map zoom and center based on URL params.
  useEffect(() => {
    if (paramsRead) {
      return;
    }

    // Load stops from URL. If two or more, switch to routing mode.
    const stopStrings: string[] = searchParams.get("s")
      ? searchParams.get("s")!.split("_")
      : [];
    let stops: { lng: number; lat: number }[] = [];
    for (const stopString of stopStrings) {
      const stopCoords = stopString.split("-").map(parseFloat);
      if (stopCoords.length === 2 && !stopCoords.some(isNaN)) {
        stops.push({ lng: stopCoords[0], lat: stopCoords[1] });
      } else {
        stops = [];
        break;
      }
    }
    if (stops.length > 1) {
      dispatch(stopsResetted());
      dispatch(switchedToRouting());
      stops.forEach((stop) => dispatch(stopAdded(stop)));
    }

    // Load zoom from URL.
    const zoom: number | null = searchParams.get("z")
      ? parseFloat(searchParams.get("z") as string)
      : null;

    // Load location marker from URL.
    const locationMarkerCoords = searchParams.get("lm")
      ? searchParams.get("lm")!.split("-").map(parseFloat)
      : [];
    const locationMarker: [number, number] | null =
      locationMarkerCoords.length === 2 && !locationMarkerCoords.some(isNaN)
        ? [locationMarkerCoords[0], locationMarkerCoords[1]]
        : null;
    if (locationMarker) {
      dispatch(
        selectedLocation({
          location: {
            center: {
              lng: locationMarker[0],
              lat: locationMarker[1],
            },
            label: null,
          },
        }),
      );
    }

    // Load street preferences from URL.
    const preferences = searchParams.get("p")
      ? searchParams
          .get("p")!
          .split("-")
          .map((val) => parseInt(val))
      : [];
    if (
      preferences.length === 3 &&
      !preferences.some((number) => isNaN(number) || number > 100 || number < 0)
    ) {
      dispatch(
        streetPreferenceChanged({ id: "safety", value: preferences[0] }),
      );
      dispatch(
        streetPreferenceChanged({ id: "comfort", value: preferences[1] }),
      );
      dispatch(
        streetPreferenceChanged({ id: "beauty", value: preferences[2] }),
      );
    }

    // Load routing options from URL.
    const routingOptions =
      stops.length > 1 && searchParams.get("ro")
        ? searchParams.get("ro")!.split("-")
        : [];
    dispatch(setUseShortest(routingOptions.includes("sh")));

    // Load center from URL.
    const centerCoords = searchParams.get("c")
      ? searchParams.get("c")!.split("-").map(parseFloat)
      : [];
    const center: [number, number] | null =
      centerCoords.length === 2 && !centerCoords.some(isNaN)
        ? [centerCoords[0], centerCoords[1]]
        : null;

    // set zoom and center only (at this point) if not both are set or a way is not selected
    if (!selectedWay || (zoom && center)) {
      if (zoom) {
        dispatch(centerUpdated({ zoom, updateView: true }));
      }

      if (center) {
        dispatch(
          centerUpdated({ lng: center[0], lat: center[1], updateView: true }),
        );
      }
      // if we should use the selected ways center, we have to wait until
      // the map is available.
      dispatch(readyToRender());
    }
    if (selectedWay) {
      dispatch(waySelected(selectedWay));
    }
    setParamsRead(true);
  }, [dispatch, searchParams, mapState.readyToRender, selectedWay, paramsRead]);

  // Update search params in URL when something changed.
  useEffect(() => {
    if (!mapState.readyToRender) {
      return;
    }
    if (mapSearchParams !== null) {
      setSearchParams(() => mapSearchParams, { replace: true });
    }
  }, [mapSearchParams, setSearchParams, mapState.readyToRender]);

  return (
    <main className={styles.root}>
      <MapApp selectedWay={selectedWay}></MapApp>
    </main>
  );
}
