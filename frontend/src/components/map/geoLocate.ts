import { selectAppState, AppMode } from "@/features/map/appSlice";
import { locatedPosition, selectMapState } from "@/features/map/mapSlice";
import { GeolocateControl } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Hook to initialise the geo location functionality.
 */
export default function useGeoLocate(map: Map | null) {
  const [geoLocateControl, setGeoLocateControl] =
    useState<GeolocateControl | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!map || geoLocateControl) {
      return;
    }
    const control = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    control.on("geolocate", (position: GeolocationPosition) => {
      dispatch(
        locatedPosition({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        }),
      );
    });
    map.getMapLibre().addControl(control, "bottom-right");
    setGeoLocateControl(control);
    return () => {
      if (map && geoLocateControl) {
        map.getMapLibre().removeControl(geoLocateControl);
      }
    };
  }, [map, dispatch, geoLocateControl]);

  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);
  useEffect(() => {
    if (
      geoLocateControl &&
      mapState.currentPositionAsStart &&
      appState.mode == AppMode.Routing
    ) {
      geoLocateControl.trigger();
    }
  }, [mapState.currentPositionAsStart, appState.mode, geoLocateControl]);
}
