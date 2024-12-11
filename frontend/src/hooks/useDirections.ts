import { useEffect, useState } from "react";
import { Valhalla } from "@routingjs/valhalla";
import type { Feature } from "geojson";
import type { Stop } from "./useWay";
import config from "@/config";
import { useDispatch } from "react-redux";
import { receivedDirections } from "@/features/map/directionsSlice";

/**
 * A calculated route.
 */
export type Route = {
  // Stops of the route; First is the start, last is the finish.
  stops: Stop[];
  // Calculated segments.
  feature: Feature | null;
};

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useDirections(stops: Stop[]): Route | null {
  const [route, setRoute] = useState<null | Route>(null);
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
      setRoute({
        stops,
        feature: directions
          ? (directions.directions[0].feature as Feature)
          : null,
      });
    })();
  }, [stops, dispatch]);
  if (stops.length === 0) {
    return null;
  }
  return route;
}
