import { useEffect, useState, useMemo } from "react";
import type { GeoJSON, Feature, Position } from "geojson";
import { MVTRouter, Point as WASMPoint, Route } from "ibre";

import type { Stop } from "./useWay";

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useSegmentsRoute(stops: Stop[]): Route | null {
  const router = useMemo(() => {
    return new MVTRouter(
      "http://transport-tiles.streetcritic.org/function_zxy_query",
    );
  }, []);
  const [route, setRoute] = useState<null | Route>(null);
  useEffect(() => {
    if (stops.length == 0) {
      return;
    }
    (async () => {
      const toPoint = (stop: Stop) => {
        return new WASMPoint(stop.lng, stop.lat);
      };
      const wasm_stops = stops.map(toPoint);
      console.log("findRoute");
      const route = await router.findRoute(wasm_stops);
      setRoute(route);
    })();
  }, [stops]);
  if (stops.length === 0) {
    return null;
  }
  return route;
}
