import config from "@/config";
import { AppMode, selectAppState } from "@/features/map/appSlice";
import {
  locatedPosition,
  selectMapState,
  stopAdded,
  stopChanged,
} from "@/features/map/mapSlice";
import { Paper, NavLink } from "@mantine/core";
import { Flag, FlagCheckered, FlagPennant, Gps } from "@phosphor-icons/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  // Called when a menu item is clicked.
  onClick: () => void;
};

/**
 * Context menu for certain map modes.
 */
export default function ContextMenu({ onClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);
  const dispatch = useDispatch();
  const showStopEdit = [
    AppMode.Routing,
    AppMode.WayAdding,
    AppMode.QuickWayRating,
  ].includes(appState.mode);

  if (!mapState.contextMenuPosition || !showStopEdit) {
    return null;
  }

  const lng = mapState.contextMenuPosition.lngLat.lng;
  const lat = mapState.contextMenuPosition.lngLat.lat;
  const point = mapState.contextMenuPosition.point;
  const canvasSize = mapState.contextMenuPosition.canvasSize;
  const width = containerRef.current?.offsetWidth || 0;
  const height = containerRef.current?.offsetHeight || 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        opacity: containerRef.current ? 100 : 0,
        top: !containerRef.current
          ? 0
          : point.y + height > canvasSize.height
            ? "auto"
            : point.y,
        bottom: !containerRef.current
          ? "auto"
          : point.y + height > canvasSize.height
            ? canvasSize.height - point.y
            : "auto",
        left: !containerRef.current
          ? 0
          : point.x + width > canvasSize.width
            ? "auto"
            : point.x,
        right: !containerRef.current
          ? "auto"
          : point.x + width > canvasSize.width
            ? canvasSize.width - point.x
            : "auto",
        zIndex: 10000,
      }}
    >
      <Paper shadow="sm" withBorder p={5}>
        <NavLink
          href="#"
          onClick={() => {
            dispatch(stopChanged({ index: 0, lng, lat, inactive: false }));
            onClick();
          }}
          label="Set start"
          leftSection={<Flag size={14} />}
        />
        <NavLink
          href="#"
          onClick={() => {
            dispatch(stopAdded({ index: mapState.stops.length - 1, lng, lat }));
            onClick();
          }}
          label="Add waypoint"
          leftSection={<FlagPennant size={14} />}
        />
        <NavLink
          href="#"
          label="Set destination"
          onClick={() => {
            dispatch(
              stopChanged({
                index: mapState.stops.length - 1,
                lng,
                lat,
                inactive: false,
              }),
            );
            onClick();
          }}
          leftSection={<FlagCheckered size={14} />}
        />
        {config.development && (
          <NavLink
            href="#"
            onClick={() => {
              dispatch(
                locatedPosition({
                  lng: mapState.contextMenuPosition!.lngLat.lng,
                  lat: mapState.contextMenuPosition!.lngLat.lat,
                }),
              );
              onClick();
            }}
            label="Simulate geolocate at this point"
            leftSection={<Gps size={14} />}
          />
        )}
      </Paper>
    </div>
  );
}
