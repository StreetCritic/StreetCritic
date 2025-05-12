import { Dispatch, useEffect, useRef, useState } from "react";
import {
  Map as LibreMap,
  LngLat,
  type LngLatLike,
  NavigationControl,
  StyleSpecification,
  ScaleControl,
  LngLatBounds,
} from "maplibre-gl";

import style from "./style.json";
import originalStyle from "./originalStyle.json";

import { init_hooks } from "ibre";
import { useStops } from "./stops";
import { useDispatch, useSelector } from "react-redux";
import { centerUpdated, selectMapState } from "@/features/map/mapSlice";
import { useLocationMarker } from "./locationMarker";
import { useWayDisplay } from "./wayDisplay";
import useGeoLocate from "./geoLocate";
import { useRouteDisplay } from "./routeDisplay";
import { useIndicatorLayer } from "./indicatorLayer";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import { UnknownAction } from "@reduxjs/toolkit";

export type PositionHandler = (point: LngLat) => void;
export type PositionChangeHandler = (
  index: number,
  lngLat: LngLat | null,
) => void;

// A function that returns an API access token.
export type GetAccessTokenFn = () => Promise<string | null>;

/**
 * Fit the given bounds into the map.
 */
export function fitBounds(
  bounds: LngLatBounds,
  isMobile: boolean,
  map: LibreMap,
  dispatch: Dispatch<UnknownAction>,
  resetFitPositions: boolean,
  resetFitRoute: boolean,
) {
  const padding = 50;
  const newTransform = map.cameraForBounds(bounds, {
    padding: {
      top: padding,
      bottom: padding + (isMobile ? 320 : 0),
      right: padding,
      left: padding + (isMobile ? 0 : 415),
    },
  });
  if (
    newTransform &&
    newTransform.center &&
    "lng" in newTransform.center &&
    "lat" in newTransform.center
  ) {
    dispatch(
      centerUpdated({
        lng: newTransform.center.lng,
        lat: newTransform.center.lat,
        zoom: newTransform.zoom,
        updateView: true,
        flyTo: true,
        resetFitPositionsIntoMap: resetFitPositions || undefined,
        resetFitRouteIntoMap: resetFitRoute || undefined,
      }),
    );
  }
}

type Options = {
  /** Called when the style is loaded */
  onStyleLoaded: (map: Map) => void;
  /** Initial center coordinates. */
  center: LngLatLike;
  /** Initial zoom. */
  zoom: number;
};

/**
 * Implements a wrapper for MapLibre.
 */
export class Map {
  // The MapLibre instance.
  private map: LibreMap;

  /**
   * Initializes the map.
   *
   * @param container - The HTML element to attach to.
   * @param onLoad - Callback which is called when the map is loaded.
   * rating on the map.
   */
  constructor(
    onCenterChange: (center: LngLat, zoom: number) => void,
    container: HTMLElement,
    onLoad: (map: Map) => void,
    options: Options,
  ) {
    this.map = new LibreMap({
      container,
      center: options.center,
      zoom: options.zoom,
      style: style as StyleSpecification,
      attributionControl: {
        customAttribution:
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap Mitwirkende</a> <a href = "https://www.maptiler.com/copyright/" target="_blank" >&copy; MapTiler</a>',
      },
    });

    this.map.once("styledata", () => {
      for (const layer of (originalStyle as StyleSpecification).layers) {
        // TODO remove after next tiles gen round
        if (layer.id === "bicycle-route" && layer.paint) {
          // @ts-expect-error
          layer.paint["line-opacity"] = [
            "step",
            ["zoom"],
            [
              "match",
              ["get", "cycle_net"],
              "regional",
              0.0,
              "national",
              0.0,
              1.0,
            ],
            5,
            ["match", ["get", "cycle_net"], "regional", 0.0, 1.0],
            8,
            1.0,
          ];
        }
        // @ts-expect-error TODO
        this.map.addLayer(layer, layer.beforeId);
      }
      options.onStyleLoaded(this);
    });

    const scale = new ScaleControl({
      maxWidth: 80,
      unit: "imperial",
    });
    this.map.addControl(scale);

    scale.setUnit("metric");

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
      this.map.addControl(new NavigationControl(), "bottom-right");

      this.map.on("dragstart", () => {
        this.map.getCanvas().style.cursor = "grabbing";
      });

      this.map.on("dragend", () => {
        this.map.getCanvas().style.cursor = "";
      });

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

      // this.map.addLayer({
      //   id: "rated-segments",
      //   type: "line",
      //   source: {
      //     type: "vector",
      //     url: config.ratedSegmentsURL,
      //   },
      //   "source-layer": "function_query_rated_segments",
      //   paint: {
      //     "line-color": [
      //       "interpolate",
      //       ["linear"],
      //       ["to-number", ["get", "_rating"]],
      //       ...ratingColors(),
      //     ],
      //     "line-opacity": 1,
      //     "line-width": 4,
      //   },
      // });

      this.map.on("click", (e) => {
        const ratings = this.map.queryRenderedFeatures(e.point, {
          // layers: ["bikeability"],
        });
        console.log(ratings.map((x) => x.properties));
      });

      const updateCenter = () => {
        onCenterChange(this.map.getCenter(), this.map.getZoom());
      };

      this.map.on("moveend", updateCenter);
      this.map.on("zoomend", updateCenter);

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
   * Cleans up the map.
   */
  destruct() {
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

/**
 * React hook to initialize and update the transport map.
 *
 * @param container - The map container.
 */
export function useMap(container: React.RefObject<HTMLElement>) {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const [map, setMap] = useState<Map | null>(null);

  useStops(map);
  useLocationMarker(map);
  useWayDisplay(map);
  useRouteDisplay(map);
  const onStyleLoaded = useIndicatorLayer(map);
  const onStyleLoadedRef = useRef(onStyleLoaded);
  useGeoLocate(map);
  useEffect(() => {
    onStyleLoadedRef.current = onStyleLoaded;
  }, [onStyleLoaded]);

  const [initialCenter, setInitialCenter] = useState<{
    center: LngLatLike;
    zoom: number;
  } | null>(null);
  useEffect(() => {
    if (mapState.readyToRender && initialCenter === null) {
      setInitialCenter({
        center: { lng: mapState.center.lng, lat: mapState.center.lat },
        zoom: mapState.center.zoom,
      });
    }
  }, [mapState.readyToRender, mapState.center, initialCenter]);

  // Initialize the map.
  useEffect(() => {
    if (container.current && initialCenter) {
      init_hooks();
      const onCenterChange = (center: LngLat, zoom: number) => {
        dispatch(
          centerUpdated({
            lng: center.lng,
            lat: center.lat,
            zoom,
            updateView: false,
          }),
        );
      };
      const theMap = new Map(onCenterChange, container.current, setMap, {
        onStyleLoaded: onStyleLoadedRef.current,
        center: initialCenter.center,
        zoom: initialCenter.zoom,
      });
      return () => {
        theMap.destruct();
      };
    }
  }, [dispatch, container, initialCenter]);

  // Update center when changed.
  useEffect(() => {
    if (map && mapState.center.updateView) {
      if (mapState.center.flyTo) {
        map
          .getMapLibre()
          .flyTo({ center: mapState.center, zoom: mapState.center.zoom });
      } else {
        map.getMapLibre().jumpTo({
          center: { lng: mapState.center.lng, lat: mapState.center.lat },
          zoom: mapState.center.zoom,
        });
      }
      dispatch(
        centerUpdated({ ...mapState.center, updateView: false, flyTo: false }),
      );
    }
  }, [map, mapState.center, mapState.center.updateView, dispatch]);

  const theme = useMantineTheme();
  const isMobile = !useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

  // Update view to fit stops.
  useEffect(() => {
    const stops = mapState.fitPositionsIntoMap;
    if (!map || stops.length === 0) {
      return;
    }
    const bounds = map.getMapLibre().getBounds();
    // TODO need to include padding!
    let updateNeeded = false; // simple setting to true does not
    for (const stop of stops) {
      if (!bounds.contains(stop)) {
        updateNeeded = true;
      }
      bounds.extend(stop);
    }
    if (!updateNeeded) {
      return;
    }
    fitBounds(bounds, isMobile, map.getMapLibre(), dispatch, true, false);
  }, [map, mapState.stops, dispatch, mapState.fitPositionsIntoMap, isMobile]);

  return map;
}
