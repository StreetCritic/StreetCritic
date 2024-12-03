import { useEffect, useState, useMemo } from "react";
import { MVTRouter, Point as WASMPoint, Route } from "ibre";

import type { Stop } from "./useWay";
import config from "@/config";

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useSegmentsRoute(stops: Stop[]): Route | null {
  const router = useMemo(() => {
    return new MVTRouter(config.transportTilesURL);
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
      const route = await router.findRoute(wasm_stops);
      setRoute(route);
    })();
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);
  if (stops.length === 0) {
    return null;
  }
  return route;
}
