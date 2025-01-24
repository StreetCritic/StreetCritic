import { selectMapState } from "@/features/map/mapSlice";
import type { GeoJSON } from "geojson";
import { GeoJSONSource, Map as LibreMap } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Map } from "./map";

type Props = {
  map: LibreMap;
};

/**
 * Displays routes.
 */
export default class RouteDisplay {
  map: LibreMap;

  constructor({ map }: Props) {
    this.map = map;

    this.map.addSource("route", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#0000FF",
        "line-opacity": 0.5,
        "line-width": 2,
        "line-dasharray": [3, 1],
      },
    });
  }

  /**
   * Displays the given route.
   *
   * @param route - The route to display. Remove any displayed route if null.
   */
  displayRoute(route: GeoJSON | null): void {
    const source = this.map.getSource("route");
    if (source instanceof GeoJSONSource) {
      source.setData(
        route || {
          type: "FeatureCollection",
          features: [],
        },
      );
    }
  }
}

/**
 * Hook to initialise the route display functionality.
 */
export function useRouteDisplay(map: Map | null) {
  const mapState = useSelector(selectMapState);
  const [routeDisplay, setRouteDisplay] = useState<RouteDisplay | null>(null);

  // Display route.
  useEffect(() => {
    if (map && routeDisplay) {
      routeDisplay.displayRoute(mapState.routeWay);
    }
  }, [map, mapState.routeWay, routeDisplay]);

  // Initialize RouteDisplay.
  useEffect(() => {
    if (!map) {
      return;
    }
    if (routeDisplay) {
      console.warn("routeDisplay already created");
      return;
    }
    setRouteDisplay(
      new RouteDisplay({
        map: map.getMapLibre(),
      }),
    );
  }, [map, routeDisplay]);
}
