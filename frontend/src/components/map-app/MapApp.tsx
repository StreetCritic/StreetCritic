"use client";
import { useState } from "react";

import { default as Map, MapMode } from "@/components/map";
import Button from "@/components/button";
import { useRating } from "@/hooks";
import WayCreateForm from "./WayCreateForm";
import InConstructionModal from "./InConstructionModal";
import { useAuth } from "react-oidc-context";
import { Paper } from "@mantine/core";
import { WaySelectHandler } from "@/components/map";
import { PlusCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

import styles from "./map-app.module.css";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  selectedWay: number | null;
};

export default function MapApp({ children, sidebar, selectedWay }: Props) {
  console.log("sidebar", sidebar);
  const auth = useAuth();
  const token = auth.user?.access_token || null;

  const [stops, route, onPosition, onPositionChange, onRoutePosition] =
    useRating();
  const [wayCreateFormOpen, setWayCreateFormOpen] = useState(false);
  const router = useRouter();

  const onWaySelect = (id: string) => {
    router.push(`/way/${id}`);
  };

  return (
    <div className={styles.root}>
      <Map
        route={route}
        stops={stops}
        onPosition={onPosition}
        onPositionChange={onPositionChange}
        onRoutePosition={onRoutePosition}
        onWaySelect={onWaySelect}
        styleURL="/styles.json"
        center={[8.684966, 50.110573]}
        APIToken={token}
        selectedWay={selectedWay}
        mode={MapMode.Routing}
      />
      {/* <InConstructionModal /> */}
      {route && !wayCreateFormOpen && (
        <div className={styles.actionWrap}>
          <Button
            label="Add this way"
            icon={<PlusCircle size={32} />}
            onClick={() => setWayCreateFormOpen(true)}
          />
        </div>
      )}
      {route && wayCreateFormOpen && (
        <div className={styles.actionWrap}>
          <WayCreateForm
            route={route}
            onClose={() => setWayCreateFormOpen(false)}
          />
        </div>
      )}

      {sidebar}

      {children}
    </div>
  );
}
