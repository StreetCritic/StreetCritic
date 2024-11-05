"use client";

import { useEffect, useState } from "react";
import styles from "./map.module.css";
import initIbre from "ibre";
import MapApp from "@/components/map-app";
import { useParams } from "react-router-dom";

export default function Map() {
  const [initDone, setInitDone] = useState(false);
  const { wayId } = useParams();

  useEffect(() => {
    (async () => {
      await initIbre();
      setInitDone(true);
    })();
  });

  return (
    <main className={styles.root}>
      {initDone && (
        <MapApp selectedWay={wayId ? parseInt(wayId) : null}></MapApp>
      )}
    </main>
  );
}
