"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import initIbre from "ibre";
import MapApp from "@/components/map-app";
import { useSelectedLayoutSegments } from "next/navigation";

export default function Layout({
  children,
  sidebar,
  /* params, */
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [initDone, setInitDone] = useState(false);
  const segments = useSelectedLayoutSegments();

  const selectedWay =
    (segments.length === 3 &&
      segments[0] === "(withsidebar)" &&
      segments[1] === "way" &&
      segments[2]) ||
    null;

  useEffect(() => {
    (async () => {
      await initIbre();
      setInitDone(true);
    })();
  });

  return (
    <main className={styles.root}>
      {initDone && (
        <MapApp
          selectedWay={selectedWay ? parseInt(selectedWay) : null}
          sidebar={sidebar}
        >
          {children}
        </MapApp>
      )}
    </main>
  );
}
