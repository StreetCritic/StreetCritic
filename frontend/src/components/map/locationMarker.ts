import { selectLocationState } from "@/features/map/locationSlice";
import { Marker } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Displays the location marker if set.
 */
export function useLocationMarker(map: Map | null) {
  const [marker, setMarker] = useState<Marker | null>(null);
  const locationState = useSelector(selectLocationState);
  // const dispatch = useDispatch();

  // Initializes marker.
  useEffect(() => {
    if (!map) {
      return;
    }
    const marker = new Marker();
    setMarker(marker);
    return () => {
      marker.remove();
    };
  }, [map]);

  // Show/hide location marker.
  useEffect(() => {
    if (!marker || !map) {
      return;
    }
    if (locationState.location) {
      marker.setLngLat(locationState.location.center);
      marker.addTo(map.getMapLibre());
      // newMarker.on('click', (e) => { e.stopPropagation(); dispatch(clearedLocation()); });
    } else {
      marker.remove();
    }
  }, [map, marker, locationState.location]);
}
