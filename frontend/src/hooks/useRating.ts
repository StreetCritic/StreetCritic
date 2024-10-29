import { useRoute, Point } from "./useRoute";
import { PositionHandler, PositionChangeHandler } from "@/components/map";
import { useState, useEffect, useRef, useMemo } from "react";
import { Point as WASMPoint, Route } from "ibre";
import { LngLat } from "maplibre-gl";

type Rets = [
  Point[],
  Route | null,
  PositionHandler,
  PositionChangeHandler,
  PositionHandler,
];

export function useRating(): Rets {
  const [stops, setStops] = useState<Point[]>([]);
  console.log("current stops", stops);
  const route = useRoute(stops);

  const lastChanged = useRef(1);

  const onPosition: PositionHandler = (position) => {
    const newStop = { x: position.lng, y: position.lat };
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
        { x: lngLat.lng, y: lngLat.lat },
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
        .map((stop) => ({ x: stop.x(), y: stop.y() }));
      console.log("extedend is", extended);
      setStops(extended);
    };
  }, [route, setStops]);

  const onRoutePosition: PositionHandler = (routePosition: LngLat) => {
    routePositionRef.current(routePosition);
  };

  return [stops, route, onPosition, onPositionChange, onRoutePosition];
}

export default useRating;
