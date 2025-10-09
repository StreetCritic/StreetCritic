import {
  AppMode,
  selectAppState,
  switchedToRouting,
} from "@/features/map/appSlice";
import { selectLocationState } from "@/features/map/locationSlice";
import {
  selectMapState,
  stopAdded,
  stopChanged,
} from "@/features/map/mapSlice";
import { useLocalize } from "@/hooks";
import { Menu } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@/components";

type Props = {
  children: React.ReactNode;
};

export default function NavigationMenu({ children }: Props) {
  const __ = useLocalize();

  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);
  const locationState = useSelector(selectLocationState);
  const dispatch = useDispatch();

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
    <Menu shadow="md" width={200}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Icon id="nav-start" size={18} />}
          onClick={() => {
            if (!locationState.location) {
              return;
            }
            maybeEnableRouting();
            dispatch(
              stopChanged({
                index: 0,
                lng: locationState.location?.center.lng,
                lat: locationState.location?.center.lat,
                inactive: false,
              }),
            );
          }}
        >
          {__("context-menu-set-start")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Icon id="nav-waypoint" size={18} />}
          onClick={() => {
            if (!locationState.location) {
              return;
            }
            dispatch(
              stopAdded({
                index: mapState.stops.length - 1,
                lng: locationState.location?.center.lng,
                lat: locationState.location?.center.lat,
              }),
            );
            maybeEnableRouting();
          }}
        >
          {__("context-menu-add-waypoint")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Icon id="nav-destination" size={18} />}
          onClick={() => {
            if (!locationState.location) {
              return;
            }
            dispatch(
              stopChanged({
                index: mapState.stops.length - 1,
                lng: locationState.location?.center.lng,
                lat: locationState.location?.center.lat,
                inactive: false,
              }),
            );
            maybeEnableRouting();
          }}
        >
          {__("context-menu-set-destination")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
