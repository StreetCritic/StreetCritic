"use client";
import { useState } from "react";

import { useSelector } from "react-redux";

import { default as Map, MapMode } from "@/components/map";
import { useWay, useSegments, useDirections } from "@/hooks";
import WayCreateForm from "./WayCreateForm";
import InConstructionModal from "./InConstructionModal";
import { useAuth } from "react-oidc-context";
import { Box, Paper } from "@mantine/core";
import { WaySelectHandler } from "@/components/map";

import WaySidebar from "@/components/way-sidebar";
import WayAddingSidebar from "@/components/way-adding-sidebar";
import ProfileControl from "@/components/profile-control";

import { useNavigate } from "react-router-dom";
import styles from "./MapApp.module.css";
import Sidebar from "./Sidebar";
import { LngLatLike } from "maplibre-gl";
import useNavigateMap from "@/hooks/useNavigateMap";
import LocationSearch from "../location-search";
import AddIcon from "../add-icon";
import { AppMode, selectAppState } from "@/features/map/appSlice";
import WayAddingIntroduction from "../way-adding-introduction";

import { useDispatch } from "react-redux";
import { switchedToWayAdding } from "@/features/map/appSlice";

type Props = {
  selectedWay: number | null;
  center: LngLatLike;
  onCenterUpdate: (center: LngLatLike) => void;
};

export default function MapApp({ selectedWay }: Props) {
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);

  const mapMode =
    appState.mode === AppMode.Routing
      ? MapMode.Routing
      : appState.mode === AppMode.WayAdding
        ? MapMode.WayAdding
        : MapMode.Browsing;
  const navigateMap = useNavigateMap();
  const auth = useAuth();
  const token = auth.user?.access_token || null;

  const [way, segments] = useWay(mapMode);

  const [showWayAddingIntro, setShowWayAddingIntro] = useState(false);
  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);

  const onWaySelect = (id: string) => {
    navigateMap(`/way/${id}`, { replace: false });
  };

  return (
    <div className={styles.root}>
      <Map
        route={way}
        onWaySelect={onWaySelect}
        styleURL="/styles.json"
        APIToken={token}
        selectedWay={selectedWay}
        mode={mapMode}
      />
      {/* <InConstructionModal /> */}
      {segments && wayCreateFormOpen && (
        <WayCreateForm
          route={segments}
          onClose={() => setWayCreateFormOpen(false)}
        />
      )}
      {selectedWay && (
        <Sidebar>
          <WaySidebar wayId={selectedWay} />
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
        <Sidebar>
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
            setShowWayAddingIntro(true);
          }}
        />
      </div>
    </div>
  );
}
