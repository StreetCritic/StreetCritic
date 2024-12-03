import { useEffect, useState } from "react";
import { Valhalla } from "@routingjs/valhalla";
import type { Feature } from "geojson";
import type { Stop } from "./useWay";
import config from "@/config";

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
      setRoute({
        stops,
        feature: directions
          ? (directions.directions[0].feature as Feature)
          : null,
      });
    })();
  }, [stops]);
  if (stops.length === 0) {
    return null;
  }
  return route;
}
