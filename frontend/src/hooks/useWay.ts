import { useMemo } from "react";
import { useSegmentsRoute } from "./useSegmentsRoute";
import { useDirections } from "./useDirections";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";
import { AppMode, selectAppState } from "@/features/map/appSlice";

export function useWay() {
  const allStops = useSelector(selectMapState).stops;
  const mode = useSelector(selectAppState).mode;
  const stops = useMemo(
    () => allStops.filter((stop) => !stop.inactive),
    [allStops],
  );
  useSegmentsRoute(mode === AppMode.WayAdding ? stops : []);
  useDirections(mode === AppMode.Routing ? stops : []);
}

export default useWay;
