import { selectLocationState } from "@/features/map/locationSlice";
import { selectMapState } from "@/features/map/mapSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Round the given coordinate to seven decimals.
 */
function roundCoord(coord: number): number {
  // return coord;
  return Math.round(coord * Math.pow(10, 7)) / Math.pow(10, 7);
}

/**
 * Returns search params that define the current map's view (c,z,lm).
 */
export default function useMapSearchParams(): Record<string, string> {
  const mapState = useSelector(selectMapState);
  const locationState = useSelector(selectLocationState);
  return useMemo(() => {
    const params: Record<string, string> = {
      c: `${roundCoord(mapState.center.lng)},${roundCoord(mapState.center.lat)}`,
      z: `${Math.round(mapState.center.zoom * 100) / 100}`,
    };
    if (locationState.location) {
      params.lm = `${roundCoord(locationState.location.center.lng)},${roundCoord(locationState.location.center.lat)}`;
    }
    return params;
  }, [
    mapState.center.lng,
    mapState.center.lat,
    mapState.center.zoom,
    locationState.location,
  ]);
}
