import { PositionHandler, PositionChangeHandler } from "@/components/map";
import { useState, useEffect, useRef, useMemo } from "react";
import { Point as WASMPoint, Route } from "ibre";
import { LngLat } from "maplibre-gl";
import { useSegmentsRoute } from "./useSegmentsRoute";
import { useDirections } from "./useDirections";
import { MapMode } from "@/components/map";

/**
 * A stop on the map used for ways/routes.
 */
export type Stop = {
  // Longitude, measured in degrees.
  lng: number;
  // Latitude, measured in degrees.
  lat: number;
};

type Rets = [
  Stop[],
  GeoJSON.GeoJSON,
  Route | null,
  PositionHandler,
  PositionChangeHandler,
  PositionHandler,
];

export function useWay(mapMode: MapMode): Rets {
  const [stops, setStops] = useState<Stop[]>([]);

  const route = useSegmentsRoute(mapMode === MapMode.WayAdding ? stops : []);
  const directionsRoute = useDirections(
    mapMode === MapMode.Routing ? stops : [],
  );

  console.log("current stops", stops);

  const lastChanged = useRef(1);

  const onPosition: PositionHandler = (newStop) => {
    if (lastChanged.current === 0) {
      console.log("set new stop");
      setStops((prevStops) => [prevStops[0], newStop]);
      lastChanged.current = 1;
    } else {
      setStops([newStop]);
      lastChanged.current = 0;
    }
  };

  const onPositionChange: PositionChangeHandler = (index, lngLat) => {
    console.log("onPositionChange", index, lngLat, stops);
    if (lngLat) {
      console.log("set");
      setStops((prevStops) => [
        ...prevStops.slice(0, index),
        lngLat,
        ...prevStops.slice(index + 1),
      ]);
    } else {
      console.log("delete");
      setStops((prevStops) => [
        ...prevStops.slice(0, index),
        ...prevStops.slice(index + 1),
      ]);
    }
  };

  const routePositionRef = useRef((position: LngLat) => {});

  useEffect(() => {
    if (!route) {
      return;
    }
    routePositionRef.current = (position: LngLat) => {
      console.log("routePosition", position);
      const extended = route
        .getExtendedStops(new WASMPoint(position.lng, position.lat))
        .map((stop) => ({ lng: stop.x(), lat: stop.y() }));
      console.log("extedend is", extended);
      setStops(extended);
    };
  }, [route, setStops]);

  const onRoutePosition: PositionHandler = (routePosition: LngLat) => {
    routePositionRef.current(routePosition);
  };

  const way =
    mapMode === MapMode.Routing
      ? directionsRoute?.feature?.geometry
      : route && JSON.parse(route.get_segments_as_geojson());
  console.log("the geometry", way);

  return [stops, way, route, onPosition, onPositionChange, onRoutePosition];
}

export default useWay;
