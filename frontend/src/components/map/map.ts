import { useEffect, useState } from "react";
import {
  Map as LibreMap,
  LngLat,
  type LngLatLike,
  GeoJSONSource,
  NavigationControl,
  StyleSpecification,
  ScaleControl,
  AddLayerObject,
} from "maplibre-gl";

import config from "@/config";
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
   * @param center - Initial center coordinates.
   * @param container - The HTML element to attach to.
   * @param onLoad - Callback which is called when the map is loaded.
   * @param onWaySelect - Callback which is called when the user clicks a
   * rating on the map.
   */
  constructor(
    onCenterChange: (center: LngLat, zoom: number) => void,
    container: HTMLElement,
    onLoad: (map: Map) => void,
  ) {
    this.map = new LibreMap({
      container,
      center: config.defaultMapCenter,
      zoom: config.defaultMapCenter.zoom,
      style: style as StyleSpecification,
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

    this.map.once("load", () => {
      for (const layer of originalStyle.layers) {
        this.map.addLayer(layer as AddLayerObject);
      }

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
        e.preventDefault();
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
   * Displays the given rating.
   *
   * @param id - The rating to display.
   */
  async displayRating(id: number) {
    const response = await fetch(`${config.apiURL}/ratings/${id}`);
    const data = await response.json();
    const source = this.map.getSource("existing-ways");
    if (source instanceof GeoJSONSource) {
      source.setData(data.geometry);
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

export type MapOptions = {
  selectedWay: number | null;
};

/**
 * React hook to initialize and update the transport map.
 *
 * @param container - The map container.
 */
export function useMap(
  container: React.RefObject<HTMLElement>,
  options: MapOptions,
) {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const [map, setMap] = useState<Map | null>(null);
  const { selectedWay } = options;

  useStops(map);
  useLocationMarker(map);
  useWayDisplay(map);
  useRouteDisplay(map);
  useIndicatorLayer(map);
  useGeoLocate(map);

  // Initialize the map.
  useEffect(() => {
    if (container.current) {
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
      const theMap = new Map(onCenterChange, container.current, setMap);
      console.log("map created");
      return () => {
        theMap.destruct();
      };
    }
  }, [dispatch, container]);

  // Display selected rating.
  useEffect(() => {
    if (map && selectedWay) {
      map.displayRating(selectedWay);
    }
  }, [selectedWay, map]);

  // Update center when changed.
  useEffect(() => {
    if (map && mapState.center.updateView) {
      if (mapState.center.flyTo) {
        map
          .getMapLibre()
          .flyTo({ center: mapState.center, zoom: mapState.center.zoom });
      } else {
        map.setCenter(mapState.center);
        map.setZoom(mapState.center.zoom);
      }
      dispatch(
        centerUpdated({ ...mapState.center, updateView: false, flyTo: false }),
      );
    }
  }, [map, mapState.center, mapState.center.updateView, dispatch]);

  // Update view to fit stops.
  useEffect(() => {
    if (map) {
      const stops = mapState.stops.filter((stop) => !stop.inactive);
      if (stops.length == 0) {
        return;
      }
      const bounds = map.getMapLibre().getBounds();
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
      const newTransform = map
        .getMapLibre()
        .cameraForBounds(bounds, { padding: 100 });
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
          }),
        );
      }
    }
  }, [map, mapState.stops, dispatch]);

  return map;
}
