"use client";
import { useState } from "react";

import { default as Map, MapMode } from "@/components/map";
import Button from "@/components/button";
import { useWay, useSegments, useDirections } from "@/hooks";
import WayCreateForm from "./WayCreateForm";
import InConstructionModal from "./InConstructionModal";
import { useAuth } from "react-oidc-context";
import { Paper } from "@mantine/core";
import { WaySelectHandler } from "@/components/map";
import { PlusCircle } from "@phosphor-icons/react";

import WaySidebar from "@/components/way-sidebar";

import { useNavigate } from "react-router-dom";
import styles from "./map-app.module.css";
import Sidebar from "./Sidebar";
import { LngLatLike } from "maplibre-gl";

type Props = {
  selectedWay: number | null;
  center: LngLatLike;
  onCenterUpdate: (center: LngLatLike) => void;
};

export default function MapApp({ selectedWay }: Props) {
  console.log("selected way", selectedWay);

  const [mapMode, setMapMode] = useState(MapMode.Routing);
  let navigate = useNavigate();
  const auth = useAuth();
  const token = auth.user?.access_token || null;

  const [stops, way, segments, onPosition, onPositionChange, onRoutePosition] =
    useWay(mapMode);

  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);

  const onWaySelect = (id: string) => {
    navigate(`/way/${id}`);
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
    </div>
  );
}
