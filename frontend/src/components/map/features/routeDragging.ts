import {
  selectMapState,
  stopAdded,
  stopChanged,
  stopRemoved,
} from "@/features/map/mapSlice";
import { GeoJSONSource } from "maplibre-gl";
import type { MapMouseEvent, MapTouchEvent } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "../map";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import { point, featureCollection } from "@turf/helpers";
import { cleanCoords } from "@turf/clean-coords";
import { AppMode, selectAppState } from "@/features/map/appSlice";

/**
 * Hook to initialise the route dragging functionality.
 */
export default function useRouteDragging(map: Map | null) {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();

  // Setup sources and layers.
  useEffect(() => {
    if (!map) {
      return;
    }
    const libreMap = map.getMapLibre();
    /** Stops on the route, i.e. start, in-betweens, target. */
    libreMap.addSource("route-stops", {
      type: "geojson",
      data: featureCollection([]),
    });
    libreMap.addLayer({
      id: "route-stop",
      type: "circle",
      source: "route-stops",
      paint: {
        "circle-stroke-width": 2,
        "circle-stroke-color": "#777",
        "circle-stroke-opacity": 0.5,
        "circle-color": "#AAA",
        "circle-radius": 25,
        "circle-opacity": 0.3,
      },
    });
    libreMap.addLayer({
      id: "route-stop-inner",
      type: "circle",
      source: "route-stops",
      paint: {
        "circle-stroke-width": 1,
        "circle-color": [
          "match",
          ["get", "position"],
          "first",
          "#21AB2A",
          "last",
          "#AB212A",
          "#212AAB",
        ],
        "circle-radius": 6,
        "circle-opacity": 0.5,
      },
    });
    libreMap.addLayer({
      id: "route-stop-last",
      type: "circle",
      source: "route-stops",
      filter: ["==", ["get", "position"], "last"],
      paint: {
        "circle-radius": 10,
        "circle-opacity": 0,
        "circle-stroke-width": 5,
        "circle-stroke-color": "#777",
        "circle-stroke-opacity": 0.5,
      },
    });
    /** Non-visible layer which is just a thicker route to allow more accessible
    mouse actions. */
    libreMap.addLayer({
      id: "route-selectable",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#00FF00",
        "line-opacity": 0.0,
        "line-width": 40,
      },
    });

    /** Used to draw a circle on the route when the pointer is near. */
    libreMap.addSource("route-hoverpoint", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    libreMap.addLayer({
      id: "route-hoverpoint",
      type: "circle",
      source: "route-hoverpoint",
      paint: {
        "circle-stroke-width": 3,
        "circle-color": "#FFFFFF",
        "circle-radius": 6,
      },
    });

    return () => {
      try {
        libreMap.removeLayer("route-stop");
        libreMap.removeSource("route-stops");
        libreMap.removeLayer("route-hoverpoint");
        libreMap.removeLayer("route-selectable");
        libreMap.removeSource("route-hoverpoint");
      } catch (_) {
        return;
      }
    };
  }, [map]);

  const appState = useSelector(selectAppState);
  useEffect(() => {
    if (
      ![AppMode.QuickWayRating, AppMode.WayAdding, AppMode.Routing].includes(
        appState.mode,
      ) ||
      !mapState.stops ||
      !map
    ) {
      return;
    }
    const stops = mapState.stops.filter((stop) => !stop.inactive);
    const source = map.getMapLibre().getSource("route-stops");
    if (source instanceof GeoJSONSource) {
      source.setData(
        featureCollection(
          stops.map((stop, index) => {
            const position =
              index === 0
                ? "first"
                : mapState.stops.length - 1 === index
                  ? "last"
                  : "between";
            return point([stop.lng, stop.lat], { index, position });
          }),
        ),
      );
    }
    return () => {
      const source = map.getMapLibre().getSource("route-stops");
      if (!(source instanceof GeoJSONSource)) {
        return;
      }
      source.setData(featureCollection([]));
    };
  }, [map, mapState.stops, appState.mode]);

  const routeWayRef = useRef(mapState.routeWay);

  useEffect(() => {
    routeWayRef.current = mapState.routeWay;
  }, [mapState.routeWay]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const libreMap = map.getMapLibre();

    let isDragging = false;
    let draggingStartedAt = 0;
    let isHovered = false;
    let hoveredStop = -1;

    const checkFeatures = (
      point: MapMouseEvent["point"],
      lngLat: MapMouseEvent["lngLat"],
    ) => {
      const source = libreMap.getSource("route-hoverpoint");
      if (!(source instanceof GeoJSONSource)) {
        return;
      }
      const features = libreMap.queryRenderedFeatures(point, {
        layers: ["route-selectable"],
      });
      const stops = libreMap.queryRenderedFeatures(point, {
        layers: ["route-stop"],
      });
      if (stops.length) {
        isHovered = true;
        hoveredStop = stops[0].properties.index;
        source.setData(featureCollection([]));
      } else if (features.length && !stops.length && routeWayRef.current) {
        // https://github.com/Turfjs/turf/issues/2909
        const closest = nearestPointOnLine(
          cleanCoords(routeWayRef.current),
          lngLat.toArray(),
        );
        draggingStartedAt = closest.properties.location;
        isHovered = true;
        hoveredStop = -1;
        source.setData(closest);
      } else {
        isHovered = false;
        hoveredStop = -1;
        source.setData(featureCollection([]));
      }
    };

    const handleEnd = (lngLat: MapMouseEvent["lngLat"]) => {
      if (isDragging) {
        if (hoveredStop >= 0) {
          dispatch(stopChanged({ index: hoveredStop, ...lngLat }));
        } else {
          dispatch(stopAdded({ at: draggingStartedAt, ...lngLat }));
        }
      }
      isDragging = false;
      const source = libreMap.getSource("route-hoverpoint");
      if (!(source instanceof GeoJSONSource)) {
        return;
      }
      source.setData(featureCollection([]));
    };

    const handleMove = (
      movePoint: MapMouseEvent["point"],
      lngLat: MapMouseEvent["lngLat"],
    ) => {
      const source = libreMap.getSource("route-hoverpoint");
      if (!(source instanceof GeoJSONSource)) {
        return;
      }
      if (isDragging) {
        source.setData(point(lngLat.toArray()));
        return;
      }
      checkFeatures(movePoint, lngLat);
      map.getMapLibre().getCanvas().style.cursor = isHovered ? "pointer" : "";
    };

    const subscriptions = [
      libreMap.on("click", (e: MapMouseEvent) => {
        if (isHovered) {
          e.preventDefault();
          if (hoveredStop >= 0) {
            dispatch(stopRemoved(hoveredStop));
          }
        }
      }),
      libreMap.on("touchstart", (e: MapTouchEvent) => {
        if (e.points.length === 1) {
          checkFeatures(e.point, e.lngLat);
          if (isHovered) {
            e.preventDefault();
            isDragging = true;
          }
        }
      }),
      libreMap.on("mousedown", (e: MapMouseEvent) => {
        if (isHovered) {
          e.preventDefault();
          isDragging = true;
        }
      }),
      libreMap.on("touchend", (e: MapTouchEvent) => {
        handleEnd(e.lngLat);
      }),
      libreMap.on("mouseup", (e: MapMouseEvent) => {
        handleEnd(e.lngLat);
      }),
      libreMap.on("touchmove", (e: MapTouchEvent) => {
        if (e.points.length !== 1) return;
        handleMove(e.point, e.lngLat);
        if (isDragging) {
          e.preventDefault();
        }
      }),
      libreMap.on("mousemove", (e: MapMouseEvent) => {
        handleMove(e.point, e.lngLat);
        if (isDragging) {
          e.preventDefault();
        }
      }),
    ];

    return () => {
      subscriptions.forEach((s) => s.unsubscribe());
    };
  }, [map, dispatch]);
}
