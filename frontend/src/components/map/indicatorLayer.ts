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
    const lineColor = [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      "#fff",
      13,
      [
        "case",
        [
          "all",
          ["has", "streetcritic:indicator:bikeability"],
          ["!=", ["get", "class"], "trunk"],
          ["!=", ["get", "bicycle"], "no"],
          ["!=", ["get", "bicycle"], "use_sidepath"],
          [
            "any",
            ["==", ["get", "bicycle"], "yes"],
            ["!=", ["get", "subclass"], "footway"],
          ],
        ],
        [
          "interpolate",
          ["linear"],
          [
            "*",
            ["to-number", ["get", "streetcritic:indicator:bikeability"]],
            10,
          ],
          ...ratingColors(),
        ],
        "#fff",
      ],
    ];
    this.map.setPaintProperty("highway-minor", "line-color", lineColor);
    this.map.setPaintProperty(
      "highway-secondary-tertiary",
      "line-color",
      lineColor,
    );
    this.map.setPaintProperty("bridge-path", "line-color", lineColor);
    this.map.setPaintProperty("bridge-primary", "line-color", lineColor);
    this.map.setPaintProperty("bridge-minor", "line-color", lineColor);
    this.map.setPaintProperty("bridge-trunk-primary", "line-color", lineColor);

    this.map.setPaintProperty(
      "bridge-secondary-tertiary",
      "line-color",
      lineColor,
    );

    this.map.setPaintProperty(
      "bridge-secondary-tertiary",
      "line-color",
      lineColor,
    );
    this.map.setPaintProperty("highway-primary", "line-color", lineColor);
    this.map.setPaintProperty("highway-trunk", "line-color", lineColor);
    this.map.setPaintProperty("highway-path", "line-color", lineColor);
  }

  /**
   * Set visible state of the layer.
   */
  set_visible(visible: boolean) {
    return;
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
