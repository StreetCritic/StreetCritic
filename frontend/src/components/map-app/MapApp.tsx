"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLoginGate, useNavigateMap, useWay } from "@/hooks";

import { MapPinPlus, TrafficSign } from "@phosphor-icons/react";

import LocationQuery from "../location-query";
import LocationSearch from "../location-search";
import Sidebar from "./Sidebar";
import WayAddingIntroduction from "../way-adding-introduction";
import WayCreateForm from "./WayCreateForm";
import {
  ActionIcon,
  RoutingSidebar,
  WaySidebar,
  WayAddingSidebar,
  ProfileControl,
} from "@/components";
import { default as Map, Legend } from "@/components/map";

import { Group } from "@mantine/core";

import {
  AppMode,
  selectAppState,
  switchedToBrowsing,
  switchedToRouting,
} from "@/features/map/appSlice";
import { switchedToWayAdding } from "@/features/map/appSlice";
import { selectMapState } from "@/features/map/mapSlice";

import styles from "./MapApp.module.css";

type Props = {
  selectedWay: number | null;
};

export default function MapApp({ selectedWay }: Props) {
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const mapState = useSelector(selectMapState);
  const [loginModal, requireAuthentication] = useLoginGate();
  const navigateMap = useNavigateMap();
  const [way, segments] = useWay();
  const [showWayAddingIntro, setShowWayAddingIntro] = useState(false);
  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);

  const onWaySelect = useCallback(
    (id: number) => {
      navigateMap(`/way/${id}`, { replace: false });
    },
    [navigateMap],
  );

  return (
    <div className={styles.root}>
      <Map route={way} selectedWay={selectedWay} />
      {loginModal}
      {segments && wayCreateFormOpen && (
        <WayCreateForm
          route={segments}
          onCreated={(id: number) => {
            dispatch(switchedToBrowsing());
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

      {!selectedWay && mapState.locationQuery && (
        <Sidebar>
          <LocationQuery query={mapState.locationQuery} />
        </Sidebar>
      )}

      {showWayAddingIntro && (
        <WayAddingIntroduction
          onAbort={() => setShowWayAddingIntro(false)}
          onFinish={() => {
            setShowWayAddingIntro(false);
            dispatch(switchedToWayAdding());
          }}
        />
      )}

      {appState.mode === AppMode.WayAdding && (
        <Sidebar onClose={() => dispatch(switchedToBrowsing())}>
          <WayAddingSidebar
            segments={segments}
            onAddClick={() => setWayCreateFormOpen(true)}
          />
        </Sidebar>
      )}

      {appState.mode === AppMode.Routing && (
        <Sidebar onClose={() => dispatch(switchedToBrowsing())}>
          <RoutingSidebar />
        </Sidebar>
      )}

      <div className={styles.controls}>
        <ProfileControl />
        <LocationSearch />
        <Group>
          <ActionIcon
            label="Add way"
            color="blue"
            icon={<MapPinPlus size={32} weight="fill" />}
            onClick={() => {
              requireAuthentication(() => setShowWayAddingIntro(true));
            }}
          />
          <ActionIcon
            label="Start routing"
            color="gray.7"
            icon={<TrafficSign size={32} weight="fill" />}
            onClick={() => dispatch(switchedToRouting())}
          />
        </Group>
      </div>

      <div className={styles.legend}>
        <Legend />
      </div>
    </div>
  );
}
