import config from "@/config";
import { useNavigateMap, useUser } from "@/hooks";
import { FeatureCollection, MultiLineString } from "geojson";
import { GeoJSONSource, Map as LibreMap, Marker } from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetAccessTokenFn, Map } from "./map";
import MarkerElement from "./Marker";

import { Way as APIWay } from "@/api-bindings/Way";
import { createRoot } from "react-dom/client";

type WaySelectHandler = (way: number) => void;

type Props = {
  map: LibreMap;
  onWaySelect: WaySelectHandler;
  getAccessToken: GetAccessTokenFn;
};

/**
 * Displays the (rated) ways.
 */
export default class WayDisplay {
  map: LibreMap;
  private _getAccessToken: GetAccessTokenFn;
  private wayMarker: Record<string, Marker> = {};
  private onWaySelect: WaySelectHandler;

  constructor({ map, onWaySelect, getAccessToken }: Props) {
    this.map = map;
    this._getAccessToken = getAccessToken;
    this.onWaySelect = onWaySelect;

    this.map.addSource("existing-ways", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addLayer(
      {
        id: "existing-ways",
        type: "line",
        source: "existing-ways",
        paint: {
          "line-color": "#000000",
          "line-opacity": 0.3,
          "line-width": 6,
        },
      },
      "highway-name-path",
    );

    this.map.on("moveend", () => this.refreshWays());
    this.map.on("zoomend", () => this.refreshWays());
    this.refreshWays();
  }

  /**
   * Refreshes the visible ways.
   */
  async refreshWays(): Promise<void> {
    const bbox = this.map.getBounds().toArray().flat().join(",");
    const token = await this._getAccessToken();
    const response = await fetch(`${config.apiURL}/ways?bbox=${bbox}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const json: FeatureCollection<MultiLineString, APIWay> =
        await response.json();
      const source = this.map.getSource("existing-ways");
      const newMarkers: typeof this.wayMarker = {};
      for (const way of json.features) {
        const id = way.properties.id;
        if (this.wayMarker[id]) {
          newMarkers[id] = this.wayMarker[id];
          continue;
        }
        const coordinate =
          way.geometry.coordinates[
            Math.round(way.geometry.coordinates.length / 2)
          ][0];
        if (coordinate.length == 2) {
          const rootNode = document.createElement("div");
          const root = createRoot(rootNode);
          const marker = new Marker({
            offset: [0, -15],
            element: rootNode,
          }).setLngLat([coordinate[0], coordinate[1]]);
          root.render(MarkerElement({ onClick: () => this.onWaySelect(id) }));
          newMarkers[id] = marker;
          marker.addTo(this.map);
        }
      }
      for (const id of Object.keys(this.wayMarker)) {
        if (!newMarkers[id]) {
          this.wayMarker[id].remove();
        }
      }
      this.wayMarker = newMarkers;
      if (source instanceof GeoJSONSource) {
        source.setData(json);
      }
    }
  }

  /**
   * Removes the location marker.
   */
  remove(): void {}
}

/**
 * Hook to initialise the way display functionality.
 */
export function useWayDisplay(map: Map | null) {
  const [wayDisplay, setWayDisplay] = useState<WayDisplay | null>(null);
  const onWaySelectRef = useRef<WaySelectHandler>((_: number) => {});
  const navigateMap = useNavigateMap();
  const user = useUser();
  const getAccessToken = useCallback(async () => {
    return await user.getAccessToken();
  }, [user]);

  useEffect(() => {
    onWaySelectRef.current = (way: number) => {
      navigateMap(`/way/${way}`, { replace: false });
    };
  }, [navigateMap]);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (wayDisplay) {
      console.warn("wayDisplay already created");
      return;
    }
    setWayDisplay(
      new WayDisplay({
        map: map.getMapLibre(),
        onWaySelect: (way: number) => {
          onWaySelectRef.current(way);
        },
        getAccessToken,
      }),
    );
  }, [map, getAccessToken, onWaySelectRef, wayDisplay]);
}
