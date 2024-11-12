import { PositionHandler, PositionChangeHandler } from "@/components/map";
import { useState, useEffect, useRef, useMemo } from "react";
import { Point as WASMPoint, Route } from "ibre";
import { LngLat } from "maplibre-gl";
import { useSegmentsRoute } from "./useSegmentsRoute";
import { useDirections } from "./useDirections";
import { MapMode } from "@/components/map";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";

/**
 * A stop on the map used for ways/routes.
 */
export type Stop = {
  // Longitude, measured in degrees.
  lng: number;
  // Latitude, measured in degrees.
  lat: number;
};

type Rets = [GeoJSON.GeoJSON, Route | null];

export function useWay(mapMode: MapMode): Rets {
  const stops = useSelector(selectMapState).stops;

  const route = useSegmentsRoute(mapMode === MapMode.WayAdding ? stops : []);
  const directionsRoute = useDirections(
    mapMode === MapMode.Routing ? stops : [],
  );

  const way = useMemo(() => {
    return mapMode === MapMode.Routing
      ? directionsRoute?.feature?.geometry
      : MapMode.WayAdding
        ? route && JSON.parse(route.get_segments_as_geojson())
        : null;
  }, [mapMode, route]);

  return [way, route];
}

export default useWay;
