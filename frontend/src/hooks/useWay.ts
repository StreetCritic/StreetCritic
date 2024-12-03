import { useMemo } from "react";
import { Route } from "ibre";
import { useSegmentsRoute } from "./useSegmentsRoute";
import { useDirections } from "./useDirections";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";
import { AppMode, selectAppState } from "@/features/map/appSlice";

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

export function useWay(): Rets {
  const mode = useSelector(selectAppState).mode;
  const stops = useSelector(selectMapState).stops;

  const route = useSegmentsRoute(mode === AppMode.WayAdding ? stops : []);
  const directionsRoute = useDirections(mode === AppMode.Routing ? stops : []);

  const way = useMemo(() => {
    return mode === AppMode.Routing
      ? directionsRoute?.feature?.geometry
      : mode === AppMode.WayAdding
        ? route && JSON.parse(route.get_segments_as_geojson())
        : null;
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, route]);

  return [way, route];
}

export default useWay;
