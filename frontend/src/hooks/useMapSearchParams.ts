import { selectDirectionsState } from "@/features/map/directionsSlice";
import { selectLocationState } from "@/features/map/locationSlice";
import { selectMapState } from "@/features/map/mapSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Round the given coordinate to seven decimals.
 */
function roundCoord(coord: number): number {
  return Math.round(coord * Math.pow(10, 7)) / Math.pow(10, 7);
}

/**
 * Returns search params that define the current map's view.
 */
export default function useMapSearchParams(): Record<string, string> {
  const mapState = useSelector(selectMapState);
  const locationState = useSelector(selectLocationState);
  const directionsState = useSelector(selectDirectionsState);
  const stops = useSelector(selectMapState).stops;

  const locationMarkerValue = useMemo(() => {
    // console.log("locationMarker changed");
    if (locationState.location) {
      return `${roundCoord(locationState.location.center.lng)}-${roundCoord(locationState.location.center.lat)}`;
    }
    return null;
  }, [locationState.location]);

  const filteredStops = useMemo(
    () => stops.filter((stop) => !stop.inactive),
    [stops],
  );

  const stopsValue = useMemo(() => {
    // console.log("stops changed");
    if (filteredStops.length > 1) {
      return filteredStops
        .map((stop) => `${roundCoord(stop.lng)}-${roundCoord(stop.lat)}`)
        .join("_");
    }
    return null;
  }, [filteredStops]);

  const prefsValue = useMemo(() => {
    // console.log("prefs changed");
    const prefs = mapState.streetPreferences;
    return `${prefs.safety}-${prefs.comfort}-${prefs.beauty}`;
  }, [mapState.streetPreferences]);

  const routingOptionsValue = useMemo(() => {
    // console.log("routing options changed");
    if (filteredStops.length > 1 && directionsState.useShortest) {
      return "sh";
    }
    return null;
  }, [filteredStops, directionsState.useShortest]);

  const centerValue = useMemo(() => {
    // console.log("centerValue changed");
    return `${roundCoord(mapState.center.lng)}-${roundCoord(mapState.center.lat)}`;
  }, [mapState.center.lng, mapState.center.lat]);

  const zoomValue = useMemo(() => {
    // console.log("zoomValue changed");
    return `${Math.round(mapState.center.zoom * 100) / 100}`;
  }, [mapState.center.zoom]);

  return useMemo(() => {
    // console.log("recalculate");
    const params: Record<string, string> = {};
    params.c = centerValue;
    params.z = zoomValue;
    if (locationMarkerValue) {
      params.lm = locationMarkerValue;
    }
    if (stopsValue) {
      params.s = stopsValue;
    }
    params.p = prefsValue;
    if (routingOptionsValue) {
      params.ro = routingOptionsValue;
    }
    return params;
  }, [
    centerValue,
    zoomValue,
    locationMarkerValue,
    stopsValue,
    prefsValue,
    routingOptionsValue,
  ]);
}
