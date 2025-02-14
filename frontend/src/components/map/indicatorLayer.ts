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
  const maxPreference = Math.max(
    streetPreferences.comfort,
    streetPreferences.safety,
    streetPreferences.beauty,
  );
  console.log("update colors", streetPreferences, maxPreference);
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
          streetPreferences.beauty +
            streetPreferences.comfort +
            streetPreferences.safety,
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
export function useIndicatorLayer(map: Map | null) {
  const mapState = useSelector(selectMapState);

  const update = useCallback(
    (map: Map) => {
      updateColors(map.getMapLibre(), mapState.streetPreferences);
    },
    [mapState.streetPreferences],
  );

  useEffect(() => {
    if (!map) {
      return;
    }
    update(map);
  }, [map, mapState.streetPreferences, update]);

  const onStyleLoaded = useCallback(
    (map: Map) => {
      update(map);
    },
    [update],
  );

  return onStyleLoaded;
}
