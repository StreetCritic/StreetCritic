import { useEffect, useMemo } from "react";
import { MVTRouter, Point as WASMPoint } from "ibre";

import type { Stop } from "./useWay";
import config from "@/config";
import { useDispatch } from "react-redux";
import { routeSegmentsCalculated } from "@/features/map/mapSlice";

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useSegmentsRoute(stops: Stop[]) {
  const dispatch = useDispatch();
  const router = useMemo(() => {
    return new MVTRouter(config.transportTilesURL);
  }, []);
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

      const segments = [];
      for (const segment of route.get_segments()) {
        segments.push({
          id: segment.get_segment().get_id(),
          start: segment.get_start(),
          stop: segment.get_stop(),
        });
      }
      dispatch(
        routeSegmentsCalculated({
          segments,
          route: JSON.parse(route.get_segments_as_geojson()),
        }),
      );
    })();
  }, [router, stops, dispatch]);
}
