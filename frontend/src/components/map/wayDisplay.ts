import config from "@/config";
import { useNavigateMap, useUser } from "@/hooks";
import { FeatureCollection, MultiLineString } from "geojson";
import {
  GeoJSONSource,
  Map as LibreMap,
  Marker,
  Subscription,
} from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetAccessTokenFn, Map } from "./map";
import MarkerElement from "./Marker";

import { Way as APIWay } from "@/api-bindings/Way";
import { createRoot } from "react-dom/client";
import { useSelector } from "react-redux";
import { AppMode, selectAppState } from "@/features/map/appSlice";

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
  private lastBBox: string = "";
  private subscriptions: Subscription[] = [];

  /** Should the ways and markers be shown? */
  private visible = false;

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
      promoteId: "id",
    });

    this.map.addLayer(
      {
        id: "existing-ways",
        type: "line",
        source: "existing-ways",
        paint: {
          "line-color": "#d53e4f",
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0,
          ],
          "line-width": 5,
        },
      },
      "highway-name-path",
    );

    this.subscriptions.push(this.map.on("moveend", () => this.refreshWays()));
    this.subscriptions.push(this.map.on("zoomend", () => this.refreshWays()));
  }

  /**
   * Refreshes the visible ways.
   */
  async refreshWays(): Promise<void> {
    if (!this.visible) {
      return;
    }
    const bbox = this.map.getBounds().toArray().flat().join(",");
    if (bbox === this.lastBBox) {
      return;
    }
    this.lastBBox = bbox;
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

          const element = marker.getElement();
          element.addEventListener("mousemove", () => {
            this.map.setFeatureState(
              { source: "existing-ways", id },
              { hover: true },
            );
          });

          element.addEventListener("mouseleave", () => {
            this.map.setFeatureState(
              { source: "existing-ways", id },
              { hover: false },
            );
          });

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
   * Cleans up.
   */
  remove(): void {
    this.map.removeLayer("existing-ways");
    this.map.removeSource("existing-ways");
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.clearMarkers();
  }

  /**
   * Makes the ways and markers visible, refreshes the ways.
   */
  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) {
      this.lastBBox = "";
      this.refreshWays();
    } else {
      this.clearMarkers();
    }
  }

  /**
   * Clears the markers from the map.
   */
  clearMarkers() {
    for (const marker of Object.values(this.wayMarker)) {
      marker.remove();
    }
    this.wayMarker = {};
  }
}

/**
 * Hook to initialise the way display functionality.
 */
export function useWayDisplay(map: Map | null) {
  const [wayDisplay, setWayDisplay] = useState<WayDisplay | null>(null);
  const onWaySelectRef = useRef<WaySelectHandler>((_: number) => {});
  const appState = useSelector(selectAppState);
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

  // Make ways/markers (in)visible.
  useEffect(() => {
    const visible = appState.mode === AppMode.Browsing;
    wayDisplay?.setVisible(visible);
  }, [wayDisplay, appState.mode]);

  // Create instance.
  useEffect(() => {
    if (!map) {
      return;
    }
    const wayDisplay = new WayDisplay({
      map: map.getMapLibre(),
      onWaySelect: (way: number) => {
        onWaySelectRef.current(way);
      },
      getAccessToken,
    });
    setWayDisplay(wayDisplay);
    return () => {
      wayDisplay.remove();
    };
  }, [map, getAccessToken, onWaySelectRef]);
}
