import {
  canceledContextMenu,
  requestedContextMenu,
  selectMapState,
} from "@/features/map/mapSlice";
import { MapMouseEvent } from "maplibre-gl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "./map";

/**
 * Hook to initialise the context menu functionality.
 *
 * @returns Handler that must be called when a context menu item is clicked.
 */
export default function useContextMenu(map: Map | null): () => void {
  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);
  useEffect(() => {
    if (!map) {
      return;
    }
    const cancel = () => {
      dispatch(canceledContextMenu());
    };

    const click = (e: MapMouseEvent) => {
      if (mapState.contextMenuPosition) {
        dispatch(canceledContextMenu());
        return;
      }
      const canvas = map.getMapLibre().getCanvas();
      dispatch(
        requestedContextMenu({
          point: { x: e.point.x, y: e.point.y },
          lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
          canvasSize: { width: canvas.width, height: canvas.height },
        }),
      );
    };

    map.getMapLibre().on("click", cancel);
    map.getMapLibre().on("dragstart", cancel);
    map.getMapLibre().on("contextmenu", click);

    return () => {
      map.getMapLibre().off("click", cancel);
      map.getMapLibre().off("dragstart", cancel);
      map.getMapLibre().off("contextmenu", click);
    };
  }, [map, dispatch, mapState.contextMenuPosition]);

  const onClick = () => {
    dispatch(canceledContextMenu());
  };

  return onClick;
}
