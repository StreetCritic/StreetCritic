"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLoginGate, useNavigateMap, useWay } from "@/hooks";

import AddIcon from "../add-icon";
import LocationQuery from "../location-query";
import LocationSearch from "../location-search";
import Sidebar from "./Sidebar";
import WayAddingIntroduction from "../way-adding-introduction";
import WayCreateForm from "./WayCreateForm";
import { WaySidebar, WayAddingSidebar, ProfileControl } from "@/components";
import { default as Map } from "@/components/map";

import {
  AppMode,
  selectAppState,
  switchedToBrowsing,
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
      {/* <InConstructionModal /> */}
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

      <div className={styles.controls}>
        <ProfileControl />
        <LocationSearch />
        <AddIcon
          onClick={() => {
            requireAuthentication(() => setShowWayAddingIntro(true));
          }}
        />
      </div>
    </div>
  );
}
