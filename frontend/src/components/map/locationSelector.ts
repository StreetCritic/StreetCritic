import { selectedLocation, SelectedWay } from "@/features/map/locationSlice";
import { MapMouseEvent, Point } from "maplibre-gl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Map } from "./map";

/** Minimum zoom level at with selecting ways is possible. */
const minZoomForWaySelection = 14;

/**
 * Implements selecting of locations on the map.
 */
export default function useLocationSelector(map: Map | null) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!map) {
      return;
    }
    let cursorModified = false;
    const mapLibre = map.getMapLibre();
    const queryFeatures = (point: Point, boxWidth: number) => {
      return map.getMapLibre().queryRenderedFeatures(
        [
          [point.x - boxWidth / 2, point.y - boxWidth / 2],
          [point.x + boxWidth / 2, point.y + boxWidth / 2],
        ],
        {
          layers: [
            "highway-path",
            "highway-path-steps",
            "highway-minor",
            "highway-secondary-tertiary",
            "highway-primary",
            "building",
          ],
        },
      );
    };

    const onClick = (e: MapMouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      let selectedWay: SelectedWay | undefined = undefined;
      if (mapLibre.getZoom() >= minZoomForWaySelection) {
        const features = queryFeatures(e.point, 10);
        if (features.length) {
          const feature = features[0];
          selectedWay = {
            geometry: feature.geometry,
          };
          if ("streetcritic:indicator:bike_comfort" in feature.properties) {
            selectedWay.indicators = {
              bikeComfort:
                feature.properties["streetcritic:indicator:bike_comfort"],
              bikeSafety:
                feature.properties["streetcritic:indicator:bike_safety"],
              beauty: feature.properties["streetcritic:indicator:beauty"],
            };
          }
        }
      }
      dispatch(
        selectedLocation({
          location: {
            center: { lng: e.lngLat.lng, lat: e.lngLat.lat },
            label: null,
          },
          selectedWay,
        }),
      );
    };

    const onMove = (e: MapMouseEvent) => {
      if (mapLibre.getZoom() < minZoomForWaySelection) {
        if (cursorModified) {
          map.getMapLibre().getCanvas().style.cursor = "";
          cursorModified = false;
        }
        return;
      }
      const features = queryFeatures(e.point, 10);
      if (features.length) {
        if (!cursorModified) {
          map.getMapLibre().getCanvas().style.cursor = "pointer";
          cursorModified = true;
        }
      } else if (cursorModified) {
        map.getMapLibre().getCanvas().style.cursor = "";
        cursorModified = false;
      }
    };

    mapLibre.on("mousemove", onMove);
    mapLibre.on("click", onClick);

    return () => {
      mapLibre.off("mousemove", onMove);
      mapLibre.off("click", onClick);
      if (cursorModified) {
        map.getMapLibre().getCanvas().style.cursor = "";
      }
    };
  }, [map, dispatch]);
}
