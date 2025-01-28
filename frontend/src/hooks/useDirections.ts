import { useEffect } from "react";
import { Valhalla, ValhallaCostingOptsBicycle } from "@routingjs/valhalla";
import type { Feature, LineString } from "geojson";
import type { LngLat as Stop } from "@/features/map";
import config from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  receivedDirections,
  selectDirectionsState,
} from "@/features/map/directionsSlice";
import { selectMapState } from "@/features/map/mapSlice";

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useDirections(stops: Stop[]) {
  const dispatch = useDispatch();
  const directionsState = useSelector(selectDirectionsState);
  const mapState = useSelector(selectMapState);
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
              {
                preference: directionsState.useShortest
                  ? "shortest"
                  : undefined,
                costingOpts: {
                  use_ferry: mapState.streetPreferences.comfort / 100,
                  use_lit: mapState.streetPreferences.beauty / 100,
                  use_roads: mapState.streetPreferences.safety / 100,
                } as ValhallaCostingOptsBicycle,
              },
            )
          : null;
      if (directions) {
        const direction = directions.directions[0];
        dispatch(
          receivedDirections({
            feature: direction.feature as Feature<LineString>,
            distance: direction.feature.properties.distance || 0,
            duration: direction.feature.properties.duration || 0,
          }),
        );
      }
    })();
  }, [
    stops,
    dispatch,
    directionsState.useShortest,
    mapState.streetPreferences.beauty,
    mapState.streetPreferences.comfort,
    mapState.streetPreferences.safety,
  ]);
}
