import { AppMode, selectAppState } from "@/features/map/appSlice";
import { useGetWayQuery } from "@/services/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { GeoJSONSource } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Map } from "./map";

/**
 * Displays any selected way.
 */
export default function useSelectedWayHighlight(map: Map | null) {
  const [initialized, setInitialized] = useState(false);
  const appState = useSelector(selectAppState);
  const { wayId } = useParams();
  // TODO includeUsers is currently needed to prevent two requests. See TODO in api.ts
  const { data } = useGetWayQuery(
    wayId ? { id: parseInt(wayId), includeUser: true } : skipToken,
  );

  // Initializes highlight.
  useEffect(() => {
    if (!map) {
      return;
    }
    const mapLibre = map.getMapLibre();

    mapLibre.addSource("selected-way", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    mapLibre.addLayer(
      {
        id: "selected-way",
        type: "line",
        source: "selected-way",
        layout: {
          "line-cap": "round",
        },
        paint: {
          "line-color": "#d53e4f",
          "line-opacity": 1,
          "line-width": 5,
        },
      },
      "highway-name-path",
    );

    setInitialized(true);

    return () => {
      try {
        mapLibre.removeLayer("selected-way");
        mapLibre.removeSource("selected-way");
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
    const source = map.getMapLibre().getSource("selected-way");
    if (source instanceof GeoJSONSource) {
      source.setData(
        data && wayId && appState.mode === AppMode.Browsing
          ? data.geometry
          : {
              type: "FeatureCollection",
              features: [],
            },
      );
    }
  }, [map, initialized, data, appState.mode, wayId]);
}
