import { LngLatLike, Map, Marker } from "maplibre-gl";

/**
 * Displays the location marker if set.
 */
export default class LocationMarker {
  map: Map;
  private marker: Marker | null = null;

  constructor(map: Map) {
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
