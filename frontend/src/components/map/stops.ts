import {
  selectMapState,
  stopChanged,
  stopRemoved,
} from "@/features/map/mapSlice";
import { LngLat as Stop } from "@/features/map";
import { Marker } from "maplibre-gl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "./map";

// TODO Use WASM function that builds on getExtendedStops (via GeoJSON?)

// useEffect(() => {
//   if (!route) {
//     return;
//   }
//   routePositionRef.current = (position: LngLat) => {
//     console.log("routePosition", position);
//     const extended = route
//       .getExtendedStops(new WASMPoint(position.lng, position.lat))
//       .map((stop) => ({ lng: stop.x(), lat: stop.y() }));
//     console.log("extedend is", extended);
//     setStops(extended);
//   };
// }, [route, setStops]);

/**
 * Initialises stops functionality.
 */
export function useStops(map: Map | null) {
  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);
  useEffect(() => {
    if (!map) {
      return;
    }
  }, [map, dispatch]);

  // Updated displayed stops.
  useEffect(() => {
    if (!mapState.stops || !map) {
      return;
    }
    const stops = mapState.stops.filter((stop) => !stop.inactive);
    const stopMarker: Marker[] = [];

    // const onAdd = (stop: Stop) => { dispatch(stopAdded({ lng: stop.lng, lat: stop.lat })); };
    const onRemove = (index: number) => {
      dispatch(stopRemoved(index));
    };
    const onChange = (index: number, stop: Stop) => {
      dispatch(stopChanged({ index, lng: stop.lng, lat: stop.lat }));
    };

    let index = 0;
    for (const stop of stops) {
      stopMarker.push(
        new Marker({
          color:
            index == 0
              ? "#21AB2A"
              : index == stops.length - 1
                ? "#AB212A"
                : "#212AAB",
          draggable: true,
          scale: index == 0 ? 0.8 : index == stops.length - 1 ? 1.0 : 0.9,
        }).setLngLat(stop),
      );
      index++;
    }

    stopMarker.forEach((m, i) => {
      m.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        if (i === 0 || i === stopMarker.length - 1) {
          return;
        }
        onRemove(i);
      });
      m.on("dragend", () => {
        onChange(i, m.getLngLat());
      });
      m.addTo(map?.getMapLibre());
    });

    return () => {
      stopMarker.forEach((m) => m.remove());
    };
  }, [map, mapState.stops, dispatch]);
}
