import { AppMode, selectAppState } from "@/features/map/appSlice";
import { selectLocationState } from "@/features/map/locationSlice";
import { GeoJSONSource } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Displays the location highlighting if set.
 */
export default function useLocationHighlight(map: Map | null) {
  const [initialized, setInitialized] = useState(false);
  const locationState = useSelector(selectLocationState);
  const appState = useSelector(selectAppState);

  // Initializes highlight.
  useEffect(() => {
    if (!map) {
      return;
    }
    const mapLibre = map.getMapLibre();

    mapLibre.addSource("location-highlight", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    mapLibre.addLayer(
      {
        id: "location-highlight",
        type: "line",
        source: "location-highlight",
        layout: {
          // "line-join": "round",
        },
        paint: {
          "line-color": "#810f7c",
          "line-opacity": 1,
          "line-width": 4,
        },
      },
      "highway-name-path",
    );

    setInitialized(true);

    return () => {
      try {
        mapLibre.removeLayer("location-highlight");
        mapLibre.removeSource("location-highlight");
      } catch (_) {
        return;
      }
    };
  }, [map]);

  // Show/hide location highlight.
  useEffect(() => {
    if (!initialized || !map) {
      return;
    }
    const source = map.getMapLibre().getSource("location-highlight");
    if (source instanceof GeoJSONSource) {
      source.setData(
        locationState.selectedWay && appState.mode === AppMode.Browsing
          ? locationState.selectedWay.geometry
          : {
              type: "FeatureCollection",
              features: [],
            },
      );
    }
  }, [map, initialized, locationState.selectedWay, appState.mode]);
}
