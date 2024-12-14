import { useEffect } from "react";
import { Valhalla } from "@routingjs/valhalla";
import type { Feature } from "geojson";
import type { Stop } from "./useWay";
import config from "@/config";
import { useDispatch } from "react-redux";
import { receivedDirections } from "@/features/map/directionsSlice";

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useDirections(stops: Stop[]) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (stops.length === 0) {
      return;
    }
    (async () => {
      const v = new Valhalla({
        baseUrl: config.valhallaURL,
      });
      const directions =
        stops.length > 1
          ? await v.directions(
              stops.map((stop) => [stop.lat, stop.lng]),
              "bicycle",
            )
          : null;
      if (directions) {
        const direction = directions.directions[0];
        dispatch(
          receivedDirections({
            feature: direction.feature as Feature,
            distance: direction.feature.properties.distance || 0,
            duration: direction.feature.properties.duration || 0,
          }),
        );
      }
    })();
  }, [stops, dispatch]);
}
