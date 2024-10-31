import { useState, useEffect, useRef, useMemo } from "react";
import { Map as LibreMap, LngLat, Marker, type LngLatLike } from "maplibre-gl";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import type { Position } from "geojson";
// import { pointToTile } from '@mapbox/tilebelt';
import layers from "protomaps-themes-base";
import chroma from "chroma-js";

import { Point } from "@/hooks/useRoute";

// import { , init_hooks, Segment, Router, Route, LineString, Point as WASMPoint, Coord, Connector } from "ibre";
import { RoutingError, Route, Point as WASMPoint, init_hooks } from "ibre";

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
  // Visible stop marker.
  private stopMarker: Marker[];
  private onPositionChange: PositionChangeHandler;
  private APIToken: string | null;
  private ratingColorScale: any;

  /**
   * Initializes the map.
   *
   * @param styleURL - URL to the MapLibre style.
   * @param center - Initial center coordinates.
   * @param container - The HTML element to attach to.
   * @param onLoad - Callback which is called when the map is loaded.
   * @param onPosition - Callback which is called when the user clicks on the
   * map.
   * @param onPositionChange - Callback which is called when a position is
   * changed by the user. Index is the position of the index, lngLat the new position.
   * @param onRoutePosition - Callback which is called when the user clicks on the
   * @param onWaySelect - Callback which is called when the user clicks a
   * rating on the map.
   * @param APIToken - Auth token for the backend API.
   * route.
   */
  constructor(
    styleURL: string,
    center: LngLatLike,
    container: HTMLElement,
    onLoad: (map: Map) => void,
    onPosition: PositionHandler,
    onPositionChange: PositionChangeHandler,
    onRoutePosition: PositionHandler,
    onWaySelect: WaySelectHandler,
    APIToken: string | null,
  ) {
    const protocol = new Protocol();
    this.APIToken = APIToken;
    this.onPositionChange = onPositionChange;
    this.stopMarker = [];
    this.ratingColorScale = chroma.scale("Spectral");
    this.map = new LibreMap({
      container,
      // layers,
      style: "/style.json",
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
      zoom: 12,
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
      this.map.addControl(new maplibregl.NavigationControl());

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
      console.log("colors", colors);

      this.map.addLayer({
        id: "rated-segments",
        type: "line",
        source: {
          type: "vector",
          url: "http://transport-tiles.streetcritic.org/rated_segments",
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
        this.map.getCanvas().style.cursor = "crosshair";
      });

      this.map.on("click", "route", (e) => {
        console.log("click on route", e);
        // console.log(e.lngLat);
        // console.log(e.features);
        e.preventDefault();
        onRoutePosition(e.lngLat);
        // console.log(this.map.queryRenderedFeatures(e.point));
      });

      this.map.on("mouseenter", "route", () => {
        this.map.getCanvas().style.cursor = "copy";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", "route", () => {
        this.map.getCanvas().style.cursor = "crosshair";
      });

      this.map.on("click", (e) => {
        if (!e.defaultPrevented) {
          onPosition(e.lngLat);
        }
        // console.log(this.map.queryRenderedFeatures(e.point));
      });

      this.map.on("moveend", () => {
        this.refreshWays();
      });
      this.refreshWays();

      onLoad(this);

      console.log("load");
    });
  }

  async refreshWays(): Promise<void> {
    // if (!this.APIToken) {
    //   return;
    // }
    const bbox = this.map.getBounds().toArray().flat().join(",");
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "") + `/ways?bbox=${bbox}`,
      {
        headers: {
          Authorization: `Bearer ${this.APIToken}`,
        },
      },
    );
    if (response.ok) {
      const json = await response.json();
      console.log(json);

      const source = this.map.getSource("existing-ways");
      source.setData(json);
    }
  }

  /**
   * Displays the given rating.
   *
   * @param id - The rating to display.
   */
  async displayRating(id: number): void {
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "") + `/ratings/${id}`,
    );
    const data = await response.json();
    const source = this.map.getSource("existing-ways");
    source.setData(data.geometry);
  }

  /**
   * Displays the given route.
   *
   * @param route - The route to display.
   */
  displayRoute(route: Route): void {
    for (const segment of route.get_segments()) {
      console.log(
        segment.get_start(),
        segment.get_stop(),
        segment.get_segment().get_id(),
      );
    }
    const source = this.map.getSource("route");
    if (source instanceof GeoJSONSource) {
      const segments = route.get_segments_as_geojson();
      // console.log('route segments', segments);
      console.log("route segments", JSON.parse(segments));
      source.setData(
        JSON.parse(segments), // || {
        // type: "FeatureCollection",
        // features: [],
        // },
      );
    }

    this.stopMarker.forEach((m) => m.remove());
    this.stopMarker = [];

    let index = 0;
    console.log("we have stops", route.get_stops().length);
    for (const stop of route.get_stops()) {
      console.log("add stop marker", index);
      this.stopMarker.push(
        new Marker({
          color: index == 0 ? "#FFCCE6" : "#AB212A",
          draggable: true,
          scale: index == 0 ? 0.7 : 1.0,
        }).setLngLat([stop.x(), stop.y()]),
      );
      index++;
    }

    this.stopMarker.forEach((m, i) => {
      console.log("add dragend for", i);
      m.getElement().addEventListener("click", (e) => {
        e.preventDefault();
        console.log("delete position i", i);
        this.onPositionChange(i, null);
      });
      m.on("dragend", () => {
        console.log("change position i", i);
        this.onPositionChange(i, m.getLngLat());
      });
      m.addTo(this.map);
    });
  }

  /**
   * Cleans up the map.
   *
   * Removes the PMTiles protocol from MapLibre GL.
   */
  destruct() {
    maplibregl.removeProtocol("pmtiles");
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

export enum MapMode {
  Routing,
}

export type MapOptions = {
  styleURL: string;
  center: LngLatLike;
  stops: Point[];
  route: Route | null;
  onPosition: PositionHandler;
  onPositionChange: PositionChangeHandler;
  onRoutePosition: PositionHandler;
  onWaySelect: WaySelectHandler;
  APIToken: string | null;
  selectedWay: number | null;
  mode: MapMode;
};

/**
 * React hook to initialize and update the transport map.
 *
 * @param container - The map container.
 * @param styleURL - URL to the MapLibre style.
 * @param center - Initial center coordinates.
 * @param onPosition - Callback which is called when the user clicks on the
 */
export function useMap(
  container: React.RefObject<HTMLElement>,
  {
    styleURL,
    center,
    stops,
    route,
    onPosition,
    onPositionChange,
    onRoutePosition,
    onWaySelect,
    APIToken,
    selectedWay,
  }: MapOptions,
) {
  const [map, setMap] = useState<null | Map>(null);

  // Initialize the map.
  useEffect(() => {
    init_hooks();
    if (container.current) {
      const theMap = new Map(
        styleURL,
        center,
        container.current,
        setMap,
        onPosition,
        onPositionChange,
        onRoutePosition,
        onWaySelect,
        APIToken,
      );
      return () => {
        theMap.destruct();
      };
    }
  }, []);

  // Display route.
  useEffect(() => {
    if (map && route) {
      map.displayRoute(route);
    }
  }, [route, map]);

  // Display selected rating.
  useEffect(() => {
    if (map && selectedWay) {
      map.displayRating(selectedWay);
    }
  }, [selectedWay, map]);
}
