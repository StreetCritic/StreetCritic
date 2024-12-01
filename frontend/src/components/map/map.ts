import { useState, useEffect, useRef, useMemo } from "react";
import { Map as LibreMap, LngLat, Marker, type LngLatLike } from "maplibre-gl";
import maplibregl, {
  GeoJSONSource,
  NavigationControl,
  GeolocateControl,
} from "maplibre-gl";
import type { GeoJSON } from "geojson";
import { PMTiles, Protocol } from "pmtiles";
// import { pointToTile } from '@mapbox/tilebelt';
import layers from "protomaps-themes-base";
import chroma from "chroma-js";

import config from "@/config";

import style from "./style.json";

import type { Stop } from "@/hooks/useWay";

// import { , init_hooks, Segment, Router, Route, LineString, Point as WASMPoint, Coord, Connector } from "ibre";
import { RoutingError, Route, Point as WASMPoint, init_hooks } from "ibre";
import Stops from "./stops";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMapState,
  stopAdded,
  stopChanged,
  stopRemoved,
  stopsResetted,
} from "@/features/map/mapSlice";
import { AppMode, selectAppState } from "@/features/map/appSlice";
import LocationMarker from "./locationMarker";
import User from "@/User";

export type PositionHandler = (point: LngLat) => void;
export type WaySelectHandler = (id: string) => void;
export type PositionChangeHandler = (
  index: number,
  lngLat: LngLat | null,
) => void;

/**
 * Implements a wrapper for MapLibre.
 */
class Map {
  // The MapLibre instance.
  private map: LibreMap;
  private user: User;
  private ratingColorScale: any;

  /**
   * Initializes the map.
   *
   * @param styleURL - URL to the MapLibre style.
   * @param center - Initial center coordinates.
   * @param container - The HTML element to attach to.
   * @param onLoad - Callback which is called when the map is loaded.
   * @param onWaySelect - Callback which is called when the user clicks a
   * rating on the map.
   */
  constructor(
    styleURL: string,
    center: LngLatLike,
    onCenterChange: (center: LngLat) => void,
    container: HTMLElement,
    onLoad: (map: Map) => void,
    onWaySelect: WaySelectHandler,
    options: MapOptions,
  ) {
    const protocol = new Protocol();
    this.ratingColorScale = chroma.scale("Spectral");
    this.user = options.user;
    this.map = new LibreMap({
      container,
      // layers,
      style,
      // style: {
      // version: 8,
      // glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
      // sprite: "https://protomaps.github.io/basemaps-assets/sprites/v3/light",
      // sources: {
      //   "protomaps": {
      //     type: "vector",
      //     "tiles": [
      //       "https://tiles.streetcritic.org/basemap/{z}/{x}/{y}.mvt"
      //     ],
      //     "maxzoom": 15,
      //     attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
      //   }
      // },
      // layers: layers("protomaps", "light")
      // },
      center,
      zoom: options.zoom,
      attributionControl: {
        customAttribution:
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap Mitwirkende</a> <a href = "https://www.maptiler.com/copyright/" target="_blank" >&copy; MapTiler</a>',
      },
    });
    // maplibregl.addProtocol("pmtiles", protocol.tile);
    // this.map.on('mousemove', (e) => {
    //   const debugDiv = document.getElementById("debug-coords");
    //   debugDiv.textContent = `${e.lngLat.lng.toFixed(5)} ${e.lngLat.lat.toFixed(5)}`;
    // });
    // this.map.on('mousemove', (e) => {
    //   const features = this.map.queryRenderedFeatures(e.point, { layers: ["segments", "connectors"] });
    //   const debugDiv = document.getElementById("debug-id");
    //   for (const feature of features) {
    //     debugDiv.textContent = feature.properties.id;
    //   }
    // });

    // this.map.on('sourcedata', (e) => {
    //   if (e.dataType == "source" && e.type == "sourcedata" && e.source.type == "vector" && e.coord) {
    //     console.log(e.coord.canonical);
    //   }
    // });

    this.map.once("load", () => {
      this.map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: false,
        }),
        "bottom-right",
      );
      this.map.addControl(new NavigationControl(), "bottom-right");

      this.map.on("dragstart", () => {
        this.map.getCanvas().style.cursor = "grabbing";
      });

      this.map.on("dragend", () => {
        this.map.getCanvas().style.cursor = "";
      });

      // this.map.addSource("transportation", {
      //   type: "vector",
      //   url: "pmtiles:///transportation.pmtiles",
      // });

      // this.map.addSource("transportation", {
      //   type: "vector",
      //   url: "http://transport-tiles.streetcritic.org/function_zxy_query,connector",
      // });

      // this.map.addLayer({
      //   id: "segments",
      //   type: "line",
      //   source: "transportation",
      //   // source: 'segments',
      //   "source-layer": "function_zxy_query",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": "#DBB3FF",
      //     "line-opacity": 1,
      //     "line-width": 1,
      //   },
      // });

      // this.map.addLayer({
      //   id: "connectors",
      //   type: "circle",
      //   source: "transportation",
      //   // source: 'connectors',
      //   "source-layer": "connector",
      //   paint: {
      //     "circle-color": "#DB00E6",
      //     "circle-opacity": 0.7,
      //     "circle-radius": 3,
      //   },
      // });

      this.map.addSource("route", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.map.addSource("existing-ways", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.map.addSource("segments-parsed", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // this.map.addLayer({
      //   id: "segments-parsed",
      //   type: "line",
      //   source: "segments-parsed",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     // "line-color": "#00B3E6",
      //     "line-color": "#00FF00",
      //     "line-opacity": 0.3,
      //     "line-width": 10,
      //   },
      // });

      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          // "line-color": "#00B3E6",
          "line-color": "#FF0000",
          "line-opacity": 0.7,
          "line-width": 5,
        },
      });

      // this.map.addLayer(
      //   {
      //     id: "existing-ways",
      //     type: "line",
      //     source: "existing-ways",
      //     paint: {
      //       "line-color": [
      //         "interpolate",
      //         ["linear"],
      //         ["get", "rating"],
      //         ...colors,
      //       ],
      //       "line-opacity": 0.5,
      //       "line-width": 5,
      //       // "line-dasharray": [6, 3],
      //     },
      //   },
      //   "highway-name-path",
      // );

      const colors = [];
      for (let i = 0; i <= 10; i++) {
        colors.push(i);
        colors.push(this.ratingColorScale(i / 10).hex());
      }

      this.map.addLayer({
        id: "rated-segments",
        type: "line",
        source: {
          type: "vector",
          url: config.ratedSegmentsURL,
        },
        "source-layer": "function_query_rated_segments",
        paint: {
          "line-color": [
            "interpolate",
            ["linear"],
            ["to-number", ["get", "_rating"]],
            ...colors,
          ],
          "line-opacity": 1,
          "line-width": 4,
          // "line-dasharray": [6, 3],
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
            // "line-dasharray": [6, 3],
          },
        },
        "highway-name-path",
      );

      this.map.on("click", "rated-segments", (e) => {
        console.log("click on rated segment", e);
        // console.log(e.lngLat);
        // console.log(e.features);
        e.preventDefault();
        const ratings = this.map.queryRenderedFeatures(e.point, {
          layers: ["rated-segments"],
        });
        console.log(ratings);
      });

      this.map.on("click", "existing-ways", (e) => {
        console.log("click on existing way", e);
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

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", "existing-ways", () => {
        this.map.getCanvas().style.cursor = "";
      });

      this.map.on("mouseenter", "route", () => {
        this.map.getCanvas().style.cursor = "copy";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", "route", () => {
        this.map.getCanvas().style.cursor = "";
      });

      this.map.on("moveend", () => {
        this.refreshWays();
        onCenterChange(this.map.getCenter());
      });

      this.map.on("zoomend", () => {
        this.refreshWays();
        options.onZoomChange(this.map.getZoom());
      });

      this.refreshWays();
      onLoad(this);
    });
  }

  /**
   * Returns the used MapLibre instance.
   */
  getMapLibre(): LibreMap {
    return this.map;
  }

  /**
   * Refreshes the visible ways.
   */
  async refreshWays(): Promise<void> {
    const bbox = this.map.getBounds().toArray().flat().join(",");
    const token = await this.user.getAccessToken();
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
   * Displays the given rating.
   *
   * @param id - The rating to display.
   */
  async displayRating(id: number): void {
    const response = await fetch(`${config.apiURL}/ratings/${id}`);
    const data = await response.json();
    const source = this.map.getSource("existing-ways");
    source.setData(data.geometry);
  }

  /**
   * Displays the given route.
   *
   * @param route - The route to display. Remove any displayed route if null.
   */
  displayRoute(route: GeoJSON | null): void {
    const source = this.map.getSource("route");
    console.log("display route", route);
    if (source instanceof GeoJSONSource) {
      source.setData(
        route || {
          type: "FeatureCollection",
          features: [],
        },
      );
    }
  }

  /**
   * Sets center of map.
   */
  setCenter(center: LngLatLike) {
    this.map.setCenter(center);
  }

  /**
   * Sets zoom of map.
   */
  setZoom(zoom: number) {
    this.map.setZoom(zoom);
  }

  /**
   * Cleans up the map.
   *
   * Removes the PMTiles protocol from MapLibre GL.
   */
  destruct() {
    maplibregl.removeProtocol("pmtiles");
    this.map.remove();
  }

  // /**
  //  * Retrieves the currently loaded segments.
  //  */
  // async getSegments(point : Point) : Promise<Router> {
  //   // const zoom = Math.floor(this.map.getZoom());
  //   // const bounds = this.map.getBounds();
  //   const tiles = new PMTiles('/transportation.pmtiles');
  //   // const h = await tiles.getHeader();
  //   // console.log([h.minLon, h.minLat, h.maxLon, h.maxLat]);
  //   // const result = await tiles.getZxy(11, 1073, 693);
  //   const [x, y, z] = pointToTile(point.x, point.y, 14);
  //   // const [z,x,y] = [11, 1073, 693];
  //   const loaded_tiles = [];
  //   const router = new Router();
  //   console.log('loading');
  //   for (const dx of [-1, 0, 1]) {
  //     for (const dy of [-1, 0, 1]) {
  //       console.log(dx,dy);
  //       const result = await tiles.getZxy(z, x + dx, y + dy);
  //       parseMVTBuffer(router, new Uint8Array(result?.data), z, x +dx, y +dy);
  //     }
  //   }
  //   console.log('load done');
  // const result = await tiles.getZxy(z, x, y);
  // console.log("pmtiles result", result?.data);
  // const file = new File([result?.data], "transportation.mvt");
  // const url = URL.createObjectURL(file);
  // document.getElementById('download').href = url;
  // const segments = await load_tiles(11, BigInt(1073), BigInt(693), "/transportation.pmtiles");
  // const segments = parse_mvt_buffer(loaded_tiles, z, x, y);
  // const source = this.map.getSource("segments-parsed");
  // source.setData(
  //   JSON.parse(segments.to_geojson()) // || {
  //   // type: "FeatureCollection",
  //   // features: [],
  //   // },
  // );
  //   return router;
  // }
}

export type MapOptions = {
  styleURL: string;
  center: LngLatLike;
  onCenterChange: (center: LngLat) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  route: GeoJSON.GeoJSON | null;
  onWaySelect: WaySelectHandler;
  selectedWay: number | null;
  user: User;
};

type Plugins = {
  stops: Stops;
  locationMarker: LocationMarker;
};

/**
 * React hook to initialize and update the transport map.
 *
 * @param container - The map container.
 * @param styleURL - URL to the MapLibre style.
 * @param center - Initial center coordinates.
 */
export function useMap(
  container: React.RefObject<HTMLElement>,
  options: MapOptions,
) {
  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);
  const appState = useSelector(selectAppState);

  const [map, setMap] = useState<null | Map>(null);
  const [plugins, setPlugins] = useState<Plugins | null>(null);

  const {
    styleURL,
    center,
    onCenterChange,
    zoom,
    route,
    onWaySelect,
    selectedWay,
  } = options;

  // Initialize the map.
  useEffect(() => {
    init_hooks();
    if (container.current) {
      const theMap = new Map(
        styleURL,
        center,
        onCenterChange,
        container.current,
        setMap,
        onWaySelect,
        options,
      );
      const stops = new Stops(theMap.getMapLibre(), {
        onAdd: (index, stop) => {
          dispatch(stopAdded({ index, lng: stop.lng, lat: stop.lat }));
        },
        onRemove: (index) => {
          dispatch(stopRemoved(index));
        },
        onChange: (index, stop) => {
          dispatch(stopChanged({ index, lng: stop.lng, lat: stop.lat }));
        },
        onReset: () => {
          dispatch(stopsResetted());
        },
      });
      const locationMarker = new LocationMarker(theMap.getMapLibre());

      setPlugins({ stops, locationMarker });
      return () => {
        // stops.destruct();
        theMap.destruct();
      };
    }
  }, []);

  useEffect(() => {
    if (plugins?.stops) {
      if ([AppMode.Routing, AppMode.WayAdding].includes(appState.mode)) {
        plugins.stops.enable();
      } else {
        plugins.stops.disable();
      }
    }
  }, [plugins?.stops, appState.mode]);

  // Updated displayed stops.
  useEffect(() => {
    if (plugins?.stops) {
      plugins.stops.updateStops(mapState.stops);
    }
  }, [plugins?.stops, mapState.stops]);

  // Display route.
  useEffect(() => {
    if (map) {
      map.displayRoute(route);
    }
  }, [map, route, mapState.stops]);

  // Show/hide location marker.
  useEffect(() => {
    if (!plugins?.locationMarker) {
      return;
    }
    if (mapState.locationMarker) {
      plugins.locationMarker.show(mapState.locationMarker);
    } else {
      plugins.locationMarker.remove();
    }
  }, [plugins?.locationMarker, mapState.locationMarker]);

  // Display selected rating.
  useEffect(() => {
    if (map && selectedWay) {
      map.displayRating(selectedWay);
    }
  }, [selectedWay, map]);

  // Update center when changed.
  useEffect(() => {
    map && map.setCenter(center);
  }, [map, center]);

  // Update zoom when changed.
  useEffect(() => {
    map && map.setZoom(zoom);
  }, [map, zoom]);
}
