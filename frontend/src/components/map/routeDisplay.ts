import { selectMapState } from "@/features/map/mapSlice";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GeoJSONSource, LngLat, LngLatBounds } from "maplibre-gl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fitBounds, Map } from "./map";

/**
 * Hook to initialise the route display functionality.
 */
export function useRouteDisplay(map: Map | null) {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const isMobile = !useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

  // Setup source and layer.
  useEffect(() => {
    if (!map) {
      return;
    }

    const libreMap = map.getMapLibre();

    libreMap.addSource("route", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    libreMap.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#0000FF",
        "line-opacity": 0.4,
        "line-width": 6,
        "line-dasharray": [
          "step",
          ["zoom"],
          ["literal", [1, 0]],
          14,
          ["literal", [3, 2]],
          16,
          ["literal", [2, 3]],
        ],
      },
    });

    return () => {
      try {
        libreMap.removeLayer("route");
        libreMap.removeSource("route");
      } catch (_) {
        return;
      }
    };
  }, [map]);

  // Display route.
  useEffect(() => {
    if (!map) {
      return;
    }
    const route = mapState.routeWay || {
      type: "FeatureCollection",
      features: [],
    };
    const source = map.getMapLibre().getSource("route");
    if (source instanceof GeoJSONSource) {
      source.setData(route);
    }

    if (mapState.fitRouteIntoMap && route.type === "LineString") {
      const coordinates = route.coordinates.map(
        (position) => new LngLat(position[0], position[1]),
      );
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new LngLatBounds(coordinates[0], coordinates[0]),
      );
      fitBounds(bounds, isMobile, map.getMapLibre(), dispatch, false, true);
    }
  }, [map, mapState.routeWay, isMobile, dispatch, mapState.fitRouteIntoMap]);
}
