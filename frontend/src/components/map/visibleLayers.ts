import { selectVisibleLayers } from "@/features/map/mapSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Hook to initialise the visible layer switching functionality.
 */
export default function useVisibleLayers(map: Map | null) {
  const visibleLayers = useSelector(selectVisibleLayers);
  useEffect(() => {
    if (!map) {
      return;
    }
    const mapLibre = map.getMapLibre();
    const terrainVisibility = visibleLayers.terrain ? "visible" : "none";
    mapLibre.setLayoutProperty("hills", "visibility", terrainVisibility);
    mapLibre.setLayoutProperty("contour-100m", "visibility", terrainVisibility);
    mapLibre.setLayoutProperty(
      "contour-100m-elevation",
      "visibility",
      terrainVisibility,
    );
  }, [map, visibleLayers.terrain]);
}
