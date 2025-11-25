import { useEffect, useRef, useState } from "react";
import {
  Map as LibreMap,
  LngLat,
  NavigationControl,
  StyleSpecification,
  ScaleControl,
} from "maplibre-gl";

import style from "./style.json";
import originalStyle from "./originalStyle.json";

import { useDispatch, useSelector } from "react-redux";
import {
  centerUpdated,
  readyToRender,
  selectMapState,
} from "@/features/map/mapSlice";
import { fitBounds, getBoundsFromGeometry } from "@/features/map/camera";
import { useLocationMarker } from "./locationMarker";
import { useWayDisplay } from "./wayDisplay";
import useGeoLocate from "./geoLocate";
import { useRouteDisplay } from "./routeDisplay";
import { useIndicatorLayer } from "./indicatorLayer";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import { useGetWayQuery } from "@/services/api";
import { skipToken } from "@reduxjs/toolkit/query";

export type PositionHandler = (point: LngLat) => void;
export type PositionChangeHandler = (
  index: number,
  lngLat: LngLat | null,
) => void;

// A function that returns an API access token.
export type GetAccessTokenFn = () => Promise<string | null>;

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
    onLoad: () => void,
  ) {
    this.map = new LibreMap({
      container,
      attributionControl: {
        customAttribution:
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap Mitwirkende</a> <a href = "https://www.maptiler.com/copyright/" target="_blank" >&copy; MapTiler</a>',
      },
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

    // this.map.addSource("segments-parsed", {
    //   type: "geojson",
    //   data: {
    //     type: "FeatureCollection",
    //     features: [],
    //   },
    // });

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

    this.map.once("load", () => {
      const updateCenter = () => {
        onCenterChange(this.map.getCenter(), this.map.getZoom());
      };

      this.map.on("moveend", updateCenter);
      this.map.on("zoomend", updateCenter);
      onLoad();
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
export function useMap(
  container: React.RefObject<HTMLElement>,
): [Map | null, boolean] {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const [map, setMap] = useState<Map | null>(null);
  const [mapRendered, setMapRendered] = useState(false);
  const theme = useMantineTheme();
  const isMobile = !useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

  // TODO fix includeUser. not needed, but prevents double requests
  const selectedWay = useGetWayQuery(
    mapState.selectedWay
      ? { id: mapState.selectedWay, includeUser: true }
      : skipToken,
  );

  useLocationMarker(map);
  useWayDisplay(mapRendered ? map : null);
  useRouteDisplay(mapRendered ? map : null);
  const onStyleLoaded = useRef((_map: Map) => {});
  onStyleLoaded.current = useIndicatorLayer(map, mapRendered);
  useGeoLocate(map);

  // Ready to render in the case of way urls without coordinates.
  useEffect(() => {
    if (
      map &&
      !mapState.readyToRender &&
      selectedWay &&
      selectedWay.data?.geometry
    ) {
      const bounds = getBoundsFromGeometry(selectedWay.data.geometry);
      fitBounds(bounds, {
        isMobile,
        map: map.getMapLibre(),
        dispatch,
        resetFitPositions: true,
        resetFitRoute: true,
      });
      dispatch(readyToRender());
    }
  }, [map, dispatch, isMobile, selectedWay, mapState.readyToRender]);

  const initialCenter = useRef<typeof mapState.center | null>(null);
  useEffect(() => {
    initialCenter.current = mapState.center;
  }, [mapState.center]);

  // Set styles when map is ready to be rendered.
  useEffect(() => {
    if (map && mapState.readyToRender && initialCenter.current) {
      const libreMap = map.getMapLibre();
      libreMap.setZoom(initialCenter.current.zoom);
      libreMap.setCenter({
        lng: initialCenter.current.lng,
        lat: initialCenter.current.lat,
      });

      const layers: string[] = [];
      const listener = libreMap.on("styledata", () => {
        for (const layer of (originalStyle as StyleSpecification).layers) {
          // @ts-expect-error TODO
          libreMap.addLayer(layer, layer.beforeId);
          layers.push(layer.id);
        }
        onStyleLoaded.current(map);
        listener.unsubscribe();
      });
      libreMap.setStyle(style as StyleSpecification);
      return () => {
        listener.unsubscribe();
        layers.forEach((id) => {
          libreMap.removeLayer(id);
        });
      };
    }
  }, [map, mapState.readyToRender, onStyleLoaded, initialCenter]);

  // Initialize the map.
  useEffect(() => {
    if (container.current) {
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
      const theMap = new Map(onCenterChange, container.current, () =>
        setMapRendered(true),
      );
      setMap(theMap);

      const requestId = requestAnimationFrame(() => {
        // fix canvas sizing after layout is stable
        theMap.getMapLibre().resize();
      });
      return () => {
        cancelAnimationFrame(requestId);
        theMap.destruct();
      };
    }
  }, [dispatch, container]);

  //

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

  // Update view to fit stops.
  useEffect(() => {
    const stops = mapState.fitPositionsIntoMap;
    if (!map || stops.length === 0) {
      return;
    }
    const bounds = map.getMapLibre().getBounds();
    // TODO update check needs to include padding that is later applied.
    // Possible solution: calculated bounding box, check if its bigger than maps
    // bounding box.
    let updateNeeded = false;
    for (const stop of stops) {
      if (!bounds.contains(stop)) {
        updateNeeded = true;
      }
      bounds.extend(stop);
    }
    if (!updateNeeded) {
      return;
    }
    fitBounds(bounds, {
      isMobile,
      map: map.getMapLibre(),
      dispatch,
      resetFitPositions: true,
      resetFitRoute: false,
    });
  }, [map, mapState.stops, dispatch, mapState.fitPositionsIntoMap, isMobile]);

  return [map, mapRendered];
}
