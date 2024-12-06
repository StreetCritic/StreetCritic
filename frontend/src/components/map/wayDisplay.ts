import config from "@/config";
import { useNavigateMap, useUser } from "@/hooks";
import { GeoJSONSource, Map as LibreMap } from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetAccessTokenFn, Map } from "./map";

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

  constructor({ map, onWaySelect, getAccessToken }: Props) {
    this.map = map;
    this._getAccessToken = getAccessToken;

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

    this.map.on("click", "existing-ways", (e) => {
      // console.log("click on existing way", e);
      // console.log(e.lngLat);
      // console.log(e.features);
      e.preventDefault();
      const ratings = this.map.queryRenderedFeatures(e.point, {
        layers: ["existing-ways"],
      });
      if (ratings.length > 0) {
        onWaySelect(ratings[0].properties.id);
      }
    });

    this.map.on("mouseenter", "existing-ways", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", "existing-ways", () => {
      this.map.getCanvas().style.cursor = "";
    });

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
      const json = await response.json();
      const source = this.map.getSource("existing-ways");
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
  }, [map, getAccessToken, onWaySelectRef]);
}
