import { Map as LibreMap } from "maplibre-gl";
import { useCallback, useEffect } from "react";
import { Map } from "./map";
import { ratingColors } from "./colors";
import { useSelector } from "react-redux";
import { selectMapState, StreetPreferences } from "@/features/map/mapSlice";

/**
 * Updates way colors based on indicators and street preferences.
 */
export function updateColors(
  map: LibreMap,
  streetPreferences: StreetPreferences,
) {
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
        ["has", "streetcritic:indicator:bike_comfort"],
        ["!", ["in", ["get", "access"], ["literal", ["customers", "private"]]]],
        ["!", ["in", ["get", "bicycle"], ["literal", ["no", "use_sidepath"]]]],
        ["!", ["in", ["get", "class"], ["literal", ["trunk"]]]],
        [
          "!",
          [
            "in",
            ["get", "service"],
            [
              "literal",
              [
                "driveway",
                "parking_aisle",
                "drive-through",
                "emergency_access",
              ],
            ],
          ],
        ],
        [
          "any",
          ["==", ["get", "bicycle"], "yes"],
          [
            "all",
            ["!=", ["get", "foot"], "yes"],
            [
              "!",
              [
                "in",
                ["get", "subclass"],
                ["literal", ["footway", "pedestrian"]],
              ],
            ],
          ],
        ],
      ],
      [
        "interpolate",
        ["linear"],
        [
          "let",
          "preferencesSum",
          streetPreferences.beauty +
            streetPreferences.comfort +
            streetPreferences.safety,
          [
            "match",
            ["var", "preferencesSum"],
            0,
            0,
            [
              "/",
              [
                "+",
                [
                  "*",
                  ["to-number", ["get", "streetcritic:indicator:beauty"]],
                  streetPreferences.beauty * 10,
                ],
                [
                  "*",
                  ["to-number", ["get", "streetcritic:indicator:bike_comfort"]],
                  streetPreferences.comfort * 10,
                ],
                [
                  "*",
                  ["to-number", ["get", "streetcritic:indicator:bike_safety"]],
                  streetPreferences.safety * 10,
                ],
              ],
              ["var", "preferencesSum"],
            ],
          ],
        ],
        ...ratingColors(),
      ],
      "#fff",
    ],
  ];
  map.setPaintProperty("highway-minor", "line-color", lineColor);
  map.setPaintProperty("highway-secondary-tertiary", "line-color", lineColor);
  map.setPaintProperty("bridge-path", "line-color", lineColor);
  map.setPaintProperty("bridge-minor", "line-color", lineColor);
  map.setPaintProperty("bridge-trunk-primary", "line-color", lineColor);
  map.setPaintProperty("bridge-secondary-tertiary", "line-color", lineColor);
  map.setPaintProperty("bridge-secondary-tertiary", "line-color", lineColor);
  map.setPaintProperty("highway-primary", "line-color", lineColor);
  map.setPaintProperty("highway-trunk", "line-color", lineColor);
  map.setPaintProperty("highway-path", "line-color", lineColor);
  map.setPaintProperty("highway-link", "line-color", lineColor);
  map.setPaintProperty("tunnel-secondary-tertiary", "line-color", lineColor);
}

/**
 * Hook to initialise the way display functionality.
 *
 * @returns onStyleLoaded callback
 */
export function useIndicatorLayer(map: Map | null, mapRendered: boolean) {
  const mapState = useSelector(selectMapState);

  useEffect(() => {
    if (map && mapRendered) {
      updateColors(map.getMapLibre(), mapState.streetPreferences);
    }
  }, [map, mapState.streetPreferences, mapRendered]);

  return useCallback(
    (map: Map) => {
      updateColors(map.getMapLibre(), mapState.streetPreferences);
    },
    [mapState.streetPreferences],
  );
}
