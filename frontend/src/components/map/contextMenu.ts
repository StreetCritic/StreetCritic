import {
  canceledContextMenu,
  requestedContextMenu,
  selectMapState,
} from "@/features/map/mapSlice";
import { MapMouseEvent } from "maplibre-gl";
import { useEffect, useRef } from "react";
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
  const contextMenuHandler = useRef((_: MapMouseEvent) => {});
  const cancelHandler = useRef(() => {});

  // Register event handlers.
  useEffect(() => {
    if (!map) {
      return;
    }
    const onCancel = () => cancelHandler.current();
    const onContextMenu = (e: MapMouseEvent) => {
      contextMenuHandler.current(e);
    };

    let touchTimeout: number | undefined = undefined;
    const onTouchStart = (e: MapMouseEvent) => {
      touchTimeout = window.setTimeout(() => {
        onContextMenu(e);
      }, 400);
    };
    const onTouchEnd = () => {
      clearTimeout(touchTimeout);
    };

    map.getMapLibre().on("click", onCancel);
    map.getMapLibre().on("dragstart", onTouchEnd);
    map.getMapLibre().on("contextmenu", onContextMenu);
    map.getMapLibre().on("touchstart", onTouchStart);
    map.getMapLibre().on("touchend", onTouchEnd);
    map.getMapLibre().on("touchmove", onTouchEnd);
    map.getMapLibre().on("zoom", onCancel);
    map.getMapLibre().on("zoom", onTouchEnd);
    return () => {
      map.getMapLibre().off("click", onCancel);
      map.getMapLibre().off("dragstart", onTouchEnd);
      map.getMapLibre().off("contextmenu", onContextMenu);
      map.getMapLibre().off("touchstart", onTouchStart);
      map.getMapLibre().off("touchend", onTouchEnd);
      map.getMapLibre().off("touchmove", onTouchEnd);
      map.getMapLibre().off("zoom", onCancel);
      map.getMapLibre().off("zoom", onTouchEnd);
      if (touchTimeout !== undefined) {
        clearTimeout(touchTimeout);
      }
    };
  }, [map, dispatch, contextMenuHandler, cancelHandler]);

  // Setup handler functions.
  useEffect(() => {
    if (!map) {
      return;
    }
    cancelHandler.current = () => {
      if (mapState.contextMenuPosition) {
        dispatch(canceledContextMenu());
      }
    };
    contextMenuHandler.current = (e: MapMouseEvent) => {
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
  }, [
    map,
    dispatch,
    cancelHandler,
    contextMenuHandler,
    mapState.contextMenuPosition,
  ]);

  return () => cancelHandler.current();
}
