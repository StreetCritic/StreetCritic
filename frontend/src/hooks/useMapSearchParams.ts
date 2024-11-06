import { selectMapState } from "@/features/map/mapSlice";
import { useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function useMapSearchParams(): Record<string, string> {
  const mapState = useSelector(selectMapState);
  return {
    c: `${mapState.center.lng},${mapState.center.lat}`,
    z: `${mapState.zoom}`,
  };
}
