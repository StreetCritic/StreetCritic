import config from "@/config";
import {
  AppMode,
  selectAppState,
  switchedToRouting,
} from "@/features/map/appSlice";
import {
  locatedPosition,
  selectMapState,
  stopAdded,
  stopChanged,
} from "@/features/map/mapSlice";
import { useLocalize } from "@/hooks";
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
  const __ = useLocalize();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);
  const dispatch = useDispatch();
  const lng = mapState.contextMenuPosition?.lngLat.lng || 0;
  const lat = mapState.contextMenuPosition?.lngLat.lat || 0;
  const point = mapState.contextMenuPosition?.point || { x: 0, y: 0 };
  const canvasSize = mapState.contextMenuPosition?.canvasSize || {
    width: 0,
    height: 0,
  };
  const width = containerRef.current?.offsetWidth || 0;
  const height = containerRef.current?.offsetHeight || 0;

  /** If we are not in routing or a way adding mode yet, enable routing mode. */
  const maybeEnableRouting = () => {
    if (
      ![AppMode.Routing, AppMode.QuickWayRating, AppMode.WayAdding].includes(
        appState.mode,
      )
    ) {
      dispatch(switchedToRouting());
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        display:
          containerRef.current && mapState.contextMenuPosition
            ? "block"
            : "none",
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
            maybeEnableRouting();
            dispatch(stopChanged({ index: 0, lng, lat, inactive: false }));
            onClick();
          }}
          label={__("context-menu-set-start")}
          leftSection={<Flag size={14} />}
        />
        <NavLink
          href="#"
          onClick={() => {
            dispatch(stopAdded({ index: mapState.stops.length - 1, lng, lat }));
            maybeEnableRouting();
            onClick();
          }}
          label={__("context-menu-add-waypoint")}
          leftSection={<FlagPennant size={14} />}
        />
        <NavLink
          href="#"
          label={__("context-menu-set-destination")}
          onClick={() => {
            dispatch(
              stopChanged({
                index: mapState.stops.length - 1,
                lng,
                lat,
                inactive: false,
              }),
            );

            maybeEnableRouting();
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
