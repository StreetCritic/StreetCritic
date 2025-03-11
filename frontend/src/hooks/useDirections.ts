import { useEffect, useRef } from "react";
import {
  Valhalla,
  ValhallaCostingOptsBicycle,
  ValhallaAPIError,
} from "@routingjs/valhalla";
import type { Feature, LineString } from "geojson";
import type { LngLat as Stop } from "@/features/map";
import config from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  receivedDirections,
  selectDirectionsState,
} from "@/features/map/directionsSlice";
import { selectMapState } from "@/features/map/mapSlice";
import { showNotification } from "@/notifications";
import useLocalize from "./useLocalize";
import { loadingFinished, loadingStarted } from "@/features/map/appSlice";

// Unique id for loading state.
let uniqId = 0;

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useDirections(stops: Stop[]) {
  const dispatch = useDispatch();
  const directionsState = useSelector(selectDirectionsState);
  const mapState = useSelector(selectMapState);
  const abortController = useRef<AbortController>();
  const __ = useLocalize();
  useEffect(() => {
    if (stops.length === 0) {
      return;
    }
    (async () => {
      const loadingId = `directions-${uniqId++}`;
      abortController.current?.abort();
      abortController.current = new AbortController();
      const signal = abortController.current.signal;
      dispatch(loadingStarted(loadingId));
      try {
        const v = new Valhalla({
          baseUrl: config.valhallaURL,
          axiosOpts: { signal },
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
        if (directions && !signal.aborted) {
          const direction = directions.directions[0];
          dispatch(
            receivedDirections({
              feature: direction.feature as Feature<LineString>,
              distance: direction.feature.properties.distance || 0,
              duration: direction.feature.properties.duration || 0,
            }),
          );
        }
      } catch (e) {
        if ((e as ValhallaAPIError).name !== "Error") {
          console.log("Routing error: ", e);
          showNotification({
            title: __("routing-error-title"),
            message: __("routing-error-body"),
            type: "error",
          });
        }
      }
      dispatch(loadingFinished(loadingId));
    })();
    return () => {
      abortController.current?.abort();
    };
  }, [
    stops,
    dispatch,
    directionsState.useShortest,
    mapState.streetPreferences.beauty,
    mapState.streetPreferences.comfort,
    mapState.streetPreferences.safety,
    __,
  ]);
}
