"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  /* useLoginGate, */
  useNavigateMap,
  useWay,
} from "@/hooks";

import {
  /* MapPinPlus, */
  TrafficSign,
} from "@phosphor-icons/react";

import LocationSearch from "../location-search";
import WayCreateForm from "./WayCreateForm";
import {
  ActionIcon,
  LocationSideBox,
  RoutingSidebar,
  Sidebar,
  SideBox,
  WaySidebar,
  WayAddingSidebar,
  ProfileControl,
} from "@/components";
import { default as Map, Legend } from "@/components/map";

import { Box, Group, Loader } from "@mantine/core";

import {
  AppMode,
  selectAppState,
  switchedToRouting,
  /* switchedToWayAdding, */
  closedRouting,
  closedWayAdding,
  selectIsLoading,
} from "@/features/map/appSlice";
import { selectMapState } from "@/features/map/mapSlice";

import styles from "./MapApp.module.css";
import {
  clearedLocation,
  selectLocationState,
} from "@/features/map/locationSlice";
import QuickWayRating from "../quick-way-rating";

type Props = {
  selectedWay: number | null;
};

export default function MapApp({ selectedWay }: Props) {
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const mapState = useSelector(selectMapState);
  const locationState = useSelector(selectLocationState);
  const isLoading = useSelector(selectIsLoading);

  /* const [loginModal, requireAuthentication] = useLoginGate(); */
  const navigateMap = useNavigateMap();
  useWay();
  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);

  const onWaySelect = useCallback(
    (id: number) => {
      navigateMap(`/way/${id}`, { replace: false });
    },
    [navigateMap],
  );

  return (
    <div className={styles.root}>
      <Map />
      {/* {loginModal} */}
      {mapState.routeSegments && wayCreateFormOpen && (
        <WayCreateForm
          onCreated={(id: number) => {
            setWayCreateFormOpen(false);
            dispatch(closedWayAdding());
            onWaySelect(id);
          }}
          onDiscard={() => setWayCreateFormOpen(false)}
        />
      )}
      {selectedWay && (
        <Sidebar onClose={() => navigateMap("/", { replace: false })}>
          <WaySidebar wayId={selectedWay} />
        </Sidebar>
      )}

      {appState.mode === AppMode.WayAdding && (
        <Sidebar onClose={() => dispatch(closedWayAdding())}>
          <WayAddingSidebar onAddClick={() => setWayCreateFormOpen(true)} />
        </Sidebar>
      )}

      {appState.mode === AppMode.Routing && (
        <Sidebar onClose={() => dispatch(closedRouting())}>
          <RoutingSidebar />
        </Sidebar>
      )}

      {appState.mode === AppMode.Browsing && locationState.location && (
        <SideBox onClose={() => dispatch(clearedLocation())}>
          <LocationSideBox />
        </SideBox>
      )}

      {appState.mode === AppMode.QuickWayRating && <QuickWayRating />}

      <div className={styles.controls}>
        <ProfileControl />
        <Box className={styles.locationSearch}>
          <LocationSearch />
        </Box>
        {appState.mode === AppMode.Browsing && (
          <Group>
            {/* <ActionIcon
              label="Add way"
              color="blue"
              icon={<MapPinPlus size={32} weight="fill" />}
              onClick={() =>
                requireAuthentication(() => dispatch(switchedToWayAdding()))
              }
            /> */}
            <ActionIcon
              label="Start routing"
              color="gray.7"
              icon={<TrafficSign size={32} weight="fill" />}
              onClick={() => dispatch(switchedToRouting())}
            />
          </Group>
        )}
      </div>

      {appState.mode === AppMode.Browsing && (
        <div className={styles.legend}>
          <Legend />
        </div>
      )}

      {isLoading && (
        <div className={styles.loader}>
          <Loader size={30} />
        </div>
      )}
    </div>
  );
}
