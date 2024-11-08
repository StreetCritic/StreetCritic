"use client";
import { useState } from "react";

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
import ProfileControl from "@/components/profile-control";

import { useNavigate } from "react-router-dom";
import styles from "./MapApp.module.css";
import Sidebar from "./Sidebar";
import { LngLatLike } from "maplibre-gl";
import useNavigateMap from "@/hooks/useNavigateMap";
import LocationSearch from "../location-search";
import AddIcon from "../add-icon";

type Props = {
  selectedWay: number | null;
  center: LngLatLike;
  onCenterUpdate: (center: LngLatLike) => void;
};

export default function MapApp({ selectedWay }: Props) {
  console.log("selected way", selectedWay);

  const [mapMode, setMapMode] = useState(MapMode.Routing);
  const navigateMap = useNavigateMap();
  const auth = useAuth();
  const token = auth.user?.access_token || null;

  const [stops, way, segments, onPosition, onPositionChange, onRoutePosition] =
    useWay(mapMode);

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

      <ProfileControl />

      <div className={styles.locationSearch}>
        <LocationSearch />
      </div>

      <div className={styles.addIcon}>
        <AddIcon />
      </div>
    </div>
  );
}
