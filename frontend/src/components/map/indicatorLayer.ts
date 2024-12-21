import { Map as LibreMap } from "maplibre-gl";
import { useEffect, useState } from "react";
import { Map } from "./map";
import { ratingColors } from "./colors";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";

type Props = {
  map: LibreMap;
};

/**
 * Displays the (rated) ways.
 */
export default class IndicatorLayer {
  map: LibreMap;
  constructor({ map }: Props) {
    this.map = map;

    this.map.addSource("bikeability", {
      type: "vector",
      minzoom: 12,
      maxzoom: 14,
      tiles: ["http://localhost:3000/bikeability/{z}/{x}/{y}"],
    });

    this.map.addLayer(
      {
        id: "bikeability",
        type: "line",
        source: "bikeability",
        "source-layer": "transportation",
        layout: {
          "visibility": "none",
          "line-join": "round",
          "line-cap": "round",
        },
        maxzoom: 22,
        paint: {
          "line-opacity": 1,
          "line-width": ["*", ["to-number", ["get", "bikeability"]], 10],
          "line-color": [
            "interpolate",
            ["linear"],
            ["*", ["to-number", ["get", "bikeability"]], 10],
            ...ratingColors(),
          ],
        },
      },
      "highway-name-path",
    );
  }

  /**
   * Set visible state of the layer.
   */
  set_visible(visible: boolean) {
    this.map.setLayoutProperty(
      "bikeability",
      "visibility",
      visible ? "visible" : "none",
    );
  }

  /**
   * Removes the location marker.
   */
  remove(): void {}
}

/**
 * Hook to initialise the way display functionality.
 */
export function useIndicatorLayer(map: Map | null) {
  const [indicatorLayer, setIndicatorLayer] = useState<IndicatorLayer | null>(
    null,
  );
  const mapState = useSelector(selectMapState);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (indicatorLayer) {
      console.warn("indicatorLayer already created");
      return;
    }
    setIndicatorLayer(
      new IndicatorLayer({
        map: map.getMapLibre(),
      }),
    );
  }, [map, indicatorLayer]);

  useEffect(() => {
    if (!indicatorLayer) {
      return;
    }
    indicatorLayer.set_visible(mapState.ratingLayerActive);
  }, [indicatorLayer, mapState.ratingLayerActive]);
}
