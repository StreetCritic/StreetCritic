import { AppMode, selectAppState } from "@/features/map/appSlice";
import {
  selectMapState,
  stopAdded,
  stopChanged,
  stopRemoved,
} from "@/features/map/mapSlice";
import { Stop } from "@/hooks";
import { Map as LibreMap, Marker } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "./map";

export type StopsOptions = {
  // Called when a stop gets added.
  onAdd: (stop: Stop) => void;

  // Called when a stop gets removed.
  onRemove: (index: number) => void;

  // Called when a stop gets changed.
  onChange: (index: number, stop: Stop) => void;
};

/**
 * Handles stop manipulation
 */
export default class Stops {
  map: LibreMap;
  options: StopsOptions;
  disabled: boolean = true;

  private stopMarker: Marker[] = [];

  constructor(map: LibreMap, options: StopsOptions) {
    this.map = map;
    this.options = options;

    // TODO reimplement. Use WASM function that builds on getExtendedStops (via GeoJSON?)

    // this.map.on("click", "route", (e) => {
    //   console.log("click on route", e);
    //   e.preventDefault();
    // });

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
  }

  /**
   * Disables adding stops.
   */
  disable(): void {
    this.disabled = true;
  }

  /**
   * Enables adding stops.
   */
  enable(): void {
    this.disabled = false;
  }

  /**
   * Updates the stops.
   */
  updateStops(stops: Stop[]): void {
    this.stopMarker.forEach((m) => m.remove());
    this.stopMarker = [];
    let index = 0;
    for (const stop of stops) {
      this.stopMarker.push(
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

    this.stopMarker.forEach((m, i) => {
      m.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        if (i === 0 || i === this.stopMarker.length - 1) {
          return;
        }
        this.options.onRemove(i);
      });
      m.on("dragend", () => {
        // console.log("change position i", i);
        this.options.onChange(i, m.getLngLat());
      });
      m.addTo(this.map);
    });
  }
}

/**
 * Initialises stops functionality.
 */
export function useStops(map: Map | null) {
  const [stops, setStops] = useState<Stops | null>(null);
  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);

  useEffect(() => {
    if (!map) {
      return;
    }
    const stops = new Stops(map.getMapLibre(), {
      onAdd: (stop) => {
        dispatch(stopAdded({ lng: stop.lng, lat: stop.lat }));
      },
      onRemove: (index) => {
        dispatch(stopRemoved(index));
      },
      onChange: (index, stop) => {
        dispatch(stopChanged({ index, lng: stop.lng, lat: stop.lat }));
      },
    });
    setStops(stops);
  }, [map, dispatch]);

  useEffect(() => {
    if (stops) {
      if ([AppMode.Routing, AppMode.WayAdding].includes(appState.mode)) {
        stops.enable();
      } else {
        stops.disable();
      }
    }
  }, [stops, appState.mode]);

  // Updated displayed stops.
  useEffect(() => {
    if (stops) {
      stops.updateStops(mapState.stops.filter((stop) => !stop.inactive));
    }
  }, [stops, mapState.stops]);
}
