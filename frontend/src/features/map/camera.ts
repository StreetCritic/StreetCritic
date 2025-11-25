import { Map as LibreMap, LngLatBounds } from "maplibre-gl";

import { Geometry } from "geojson";
import { UnknownAction, Dispatch } from "@reduxjs/toolkit";
import { centerUpdated } from "@/features/map/mapSlice";

type FitBoundsOptions = {
  isMobile: boolean;
  map: LibreMap;
  dispatch: Dispatch<UnknownAction>;
  resetFitPositions: boolean;
  resetFitRoute: boolean;
};

/**
 * Fit the given bounds into the map.
 */
export function fitBounds(
  bounds: LngLatBounds,
  {
    isMobile,
    map,
    dispatch,
    resetFitPositions,
    resetFitRoute,
  }: FitBoundsOptions,
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

/**
 * Returns bounds for the given geometry.
 *
 * LineString and MultiLineString geometries are supported only.
 */
export function getBoundsFromGeometry(geometry: Geometry): LngLatBounds {
  let coordinates;
  if (geometry.type == "LineString") {
    coordinates = geometry.coordinates;
  } else if (geometry.type == "MultiLineString") {
    coordinates = geometry.coordinates.flat();
  } else {
    throw new Error(`Unsupported geometry type ${geometry.type}`);
  }
  coordinates = coordinates.map((position) => ({
    lng: position[0],
    lat: position[1],
  }));
  return coordinates.reduce(
    (bounds, coord) => bounds.extend(coord),
    new LngLatBounds(coordinates[0], coordinates[0]),
  );
}
