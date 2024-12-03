import { selectMapState } from "@/features/map/mapSlice";
import { useSelector } from "react-redux";

/**
 * Returns search params that define the current map's view (c,z,lm).
 */
export default function useMapSearchParams(): Record<string, string> {
  const mapState = useSelector(selectMapState);
  const params: Record<string, string> = {
    c: `${mapState.center.lng},${mapState.center.lat}`,
    z: `${mapState.center.zoom}`,
  };
  if (mapState.locationMarker) {
    params.lm = `${mapState.locationMarker.lng},${mapState.locationMarker.lat}`;
  }
  return params;
}
