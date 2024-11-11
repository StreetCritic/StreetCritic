"use client";
import { useState } from "react";

import { useSelector } from "react-redux";

import { default as Map, MapMode } from "@/components/map";
import Button from "@/components/button";
import { useWay, useSegments, useDirections } from "@/hooks";
import WayCreateForm from "./WayCreateForm";
import InConstructionModal from "./InConstructionModal";
import { useAuth } from "react-oidc-context";
import { Box, Paper } from "@mantine/core";
import { WaySelectHandler } from "@/components/map";
import { PlusCircle } from "@phosphor-icons/react";

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

  console.log("selected way", selectedWay);
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

  const [stops, way, segments, onPosition, onPositionChange, onRoutePosition] =
    useWay(mapMode);

  const [showWayAddingIntro, setShowWayAddingIntro] = useState(false);
  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);

  const onWaySelect = (id: string) => {
    navigateMap(`/way/${id}`, { replace: false });
  };

  return (
    <div className={styles.root}>
      <Map
        route={way}
        stops={stops}
        onPosition={onPosition}
        onPositionChange={onPositionChange}
        onRoutePosition={onRoutePosition}
        onWaySelect={onWaySelect}
        styleURL="/styles.json"
        APIToken={token}
        selectedWay={selectedWay}
        mode={mapMode}
      />
      {/* <InConstructionModal /> */}
      {segments && !wayCreateFormOpen && (
        <div className={styles.actionWrap}>
          <Button
            label="Add this way"
            icon={<PlusCircle size={32} />}
            onClick={() => setWayCreateFormOpen(true)}
          />
        </div>
      )}
      {segments && wayCreateFormOpen && (
        <div className={styles.actionWrap}>
          <WayCreateForm
            route={segments}
            onClose={() => setWayCreateFormOpen(false)}
          />
        </div>
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
          <WayAddingSidebar />
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
