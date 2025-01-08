import { locatedPosition } from "@/features/map/mapSlice";
import { GeolocateControl, LngLat, Map as LibreMap } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Map } from "./map";

type Options = {
  map: LibreMap;
  // Called every time the position is located.
  onLocate: (lngLat: LngLat) => void;
};

/**
 * Implements geo location functionality.
 */
class GeoLocate {
  constructor({ map, onLocate }: Options) {
    const control = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    control.on("geolocate", (position) => {
      onLocate(new LngLat(position.coords.longitude, position.coords.latitude));
    });
    map.addControl(control, "bottom-right");
  }
}

/**
 * Hook to initialise the geo location functionality.
 */
export default function useGeoLocate(map: Map | null) {
  const [geoLocate, setGeoLocate] = useState<GeoLocate | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!map) {
      return;
    }
    if (geoLocate) {
      console.warn("geoLocate already created");
      return;
    }
    setGeoLocate(
      new GeoLocate({
        map: map.getMapLibre(),
        onLocate: ({ lng, lat }: LngLat) => {
          dispatch(locatedPosition({ lng, lat }));
        },
      }),
    );
  }, [map, geoLocate, dispatch]);
}
