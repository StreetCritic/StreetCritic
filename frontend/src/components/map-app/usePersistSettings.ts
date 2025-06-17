import { selectMapState } from "@/features/map/mapSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/** Persists some map settings in local storage. */
export default function usePersistSettings() {
  const mapState = useSelector(selectMapState);
  // Persist lng,lat and zoom.
  useEffect(() => {
    localStorage.setItem("lng", mapState.center.lng.toString());
    localStorage.setItem("lat", mapState.center.lat.toString());
    localStorage.setItem("zoom", mapState.center.zoom.toString());
  }, [mapState.center]);
}
