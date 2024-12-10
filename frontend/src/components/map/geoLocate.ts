import { GeolocateControl, Map as LibreMap } from "maplibre-gl";

/**
 * Implements geo location functionality.
 */
export default class GeoLocate {
  constructor(map: LibreMap) {
    map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right",
    );
  }
}
