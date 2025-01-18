import { selectLocationState } from "@/features/map/locationSlice";
import { LngLatLike, Map as LibreMap, Marker } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Displays the location marker if set.
 */
export default class LocationMarker {
  map: LibreMap;
  private marker: Marker | null = null;

  constructor(map: LibreMap) {
    this.map = map;
    this.marker = null;
  }

  /**
   * Shows the location marker at the given coordinates.
   */
  show(coords: LngLatLike): void {
    this.marker = new Marker().setLngLat(coords);
    this.marker.addTo(this.map);
  }

  /**
   * Removes the location marker.
   */
  remove(): void {
    this.marker?.remove();
    this.marker = null;
  }
}

export function useLocationMarker(map: Map | null) {
  const [locationMarker, setLocationMarker] = useState<LocationMarker | null>(
    null,
  );
  const locationState = useSelector(selectLocationState);

  useEffect(() => {
    if (!map) {
      return;
    }
    setLocationMarker(new LocationMarker(map.getMapLibre()));
  }, [map]);

  // Show/hide location marker.
  useEffect(() => {
    if (!locationMarker) {
      return;
    }
    if (locationState.location) {
      locationMarker.show(locationState.location.center);
    } else {
      locationMarker.remove();
    }
  }, [locationMarker, locationState.location]);
}
