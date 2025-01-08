import {
  canceledContextMenu,
  requestedContextMenu,
} from "@/features/map/mapSlice";
import { MapMouseEvent } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Map } from "./map";

/**
 * Hook to initialise the context menu functionality.
 *
 * @returns Handler that must be called when a context menu item is clicked.
 */
export default function useContextMenu(map: Map | null): () => void {
  const [ignoreNext, setIgnoreNext] = useState(false);
  const onClickRef = useRef(() => {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!map) {
      return;
    }
    const move = () => {
      dispatch(canceledContextMenu());
    };

    const moveend = () => {
      setIgnoreNext(false);
    };

    const click = (e: MapMouseEvent) => {
      if (ignoreNext) {
        dispatch(canceledContextMenu());
        setIgnoreNext(false);
        return;
      }
      setIgnoreNext(true);
      const canvas = map.getMapLibre().getCanvas();
      dispatch(
        requestedContextMenu({
          point: { x: e.point.x, y: e.point.y },
          lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
          canvasSize: { width: canvas.width, height: canvas.height },
        }),
      );
    };

    onClickRef.current = () => {
      dispatch(canceledContextMenu());
      setIgnoreNext(false);
    };

    map.getMapLibre().on("dragstart", move);
    map.getMapLibre().on("dragend", moveend);
    map.getMapLibre().on("click", click);

    return () => {
      map.getMapLibre().off("dragstart", move);
      map.getMapLibre().off("dragend", moveend);
      map.getMapLibre().off("click", click);
    };
  }, [map, dispatch, ignoreNext]);

  return onClickRef.current;
}
