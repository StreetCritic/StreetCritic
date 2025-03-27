import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import {
  closedQuickWayRating,
  closedRouting,
  closedWayAdding,
  switchedToQuickWayRating,
  switchedToRouting,
  switchedToWayAdding,
} from "./appSlice";
import { receivedDirections } from "@/features/map/directionsSlice";
import { selectedLocation } from "@/features/map/locationSlice";
import { dispatchEvent, Event } from "@/events";
import { LngLat } from "./types";

import config from "@/config";

// Free unique id for the next stop.
let nextStopId = 0;

// Returns a new unique stop id.
function newStopId() {
  return nextStopId++;
}

// Returns a list of two new inactive stops with new ids.
function newInitialStops() {
  return [
    { lng: 0, lat: 0, inactive: true, id: newStopId() },
    { lng: 0, lat: 0, inactive: true, id: newStopId() },
  ];
}

// Reset routing stops and way.
function resetRouting(state: MapState) {
  state.stops = newInitialStops();
  state.routeWay = null;
  state.routeSegments = null;
}

export type RouteSegment = {
  id: string;
  start: number;
  stop: number;
};

/**
 * Preference for different rating dimensions.
 */
export type StreetPreferences = {
  safety: number;
  comfort: number;
  beauty: number;
};

export type MapState = {
  /** Is the map ready to render (e.g. all URL params parsed to store)? */
  readyToRender: boolean;
  // Map center.
  // If updateView is true, updates the map view once and sets this too false.
  center: {
    lng: number;
    lat: number;
    zoom: number;
    updateView: boolean;
    flyTo: boolean;
  };

  /**
   * Any positions that have to be fit into the visible map.
   */
  fitPositionsIntoMap: LngLat[];

  // Stops on the map.
  stops: { lng: number; lat: number; inactive: boolean; id: number }[];

  // The calculated way of a routing.
  routeWay: GeoJSON.GeoJSON | null;

  // The calculated segments of a route.
  routeSegments: RouteSegment[] | null;

  ratingLayerActive: boolean;

  // Use current position as start for routing.
  currentPositionAsStart: boolean;

  // Last located position.
  lastLocatedPosition: {
    lng: number;
    lat: number;
  } | null;

  // Position of context menu (or null if not visible).
  contextMenuPosition: null | {
    point: { x: number; y: number };
    lngLat: { lng: number; lat: number };
    canvasSize: { width: number; height: number };
  };

  // Users preferences for different rating dimensions.
  streetPreferences: StreetPreferences;
};

const initialState: MapState = {
  readyToRender: false,
  center: config.defaultMapCenter,
  fitPositionsIntoMap: [],
  stops: [],
  routeWay: null,
  routeSegments: null,
  ratingLayerActive: false,
  currentPositionAsStart: true,
  contextMenuPosition: null,
  lastLocatedPosition: null,
  streetPreferences: { safety: 50, comfort: 50, beauty: 50 },
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    // Context menu has been canceled.
    canceledContextMenu: (state) => {
      state.contextMenuPosition = null;
    },

    // Updates the map center.
    // Only updates map view if updateView is true.
    centerUpdated: (
      state,
      action: PayloadAction<{
        lng?: number;
        lat?: number;
        zoom?: number;
        updateView: boolean;
        flyTo?: boolean;
        /**
         * Should mapState.fitPositionsIntoMap be reset?
         */
        resetFitPositionsIntoMap?: boolean;
      }>,
    ) => {
      if (action.payload.lng) {
        state.center.lng = action.payload.lng;
      }
      if (action.payload.lat) {
        state.center.lat = action.payload.lat;
      }
      if (action.payload.zoom) {
        state.center.zoom = action.payload.zoom;
      }
      if (action.payload.flyTo) {
        state.center.flyTo = action.payload.flyTo;
      }
      state.center.updateView = action.payload.updateView;
      if (action.payload.resetFitPositionsIntoMap) {
        state.fitPositionsIntoMap = [];
      }
    },

    // Option to use current position as start was enabled.
    enabledCurrentPositionAsStart: (state) => {
      state.currentPositionAsStart = true;
      if (state.lastLocatedPosition) {
        state.stops[0].lng = state.lastLocatedPosition.lng;
        state.stops[0].lat = state.lastLocatedPosition.lat;
        state.stops[0].inactive = false;
      }
    },

    // Current position has been located.
    locatedPosition: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>,
    ) => {
      state.lastLocatedPosition = {
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
      if (state.currentPositionAsStart) {
        state.stops[0].lng = action.payload.lng;
        state.stops[0].lat = action.payload.lat;
        state.stops[0].inactive = false;
      }
    },

    /** The map is ready to render. */
    readyToRender: (state) => {
      state.readyToRender = true;
    },

    // Context menu has been requested.
    requestedContextMenu: (
      state,
      action: PayloadAction<{
        point: { x: number; y: number };
        lngLat: { lng: number; lat: number };
        canvasSize: { width: number; height: number };
      }>,
    ) => {
      state.contextMenuPosition = {
        point: {
          x: action.payload.point.x,
          y: action.payload.point.y,
        },
        lngLat: {
          lng: action.payload.lngLat.lng,
          lat: action.payload.lngLat.lat,
        },
        canvasSize: {
          width: action.payload.canvasSize.width,
          height: action.payload.canvasSize.height,
        },
      };
    },

    // Stop has been added.
    stopAdded: (
      state,
      action: PayloadAction<{
        index?: number;
        lng: number;
        lat: number;
        inactive?: boolean;
      }>,
    ) => {
      dispatchEvent(new Event("stop-added"));
      const inactive = action.payload.inactive || false;
      const firstInactive = state.stops.findIndex((stop) => stop.inactive);
      if (!inactive && firstInactive >= 0) {
        state.stops.splice(firstInactive, 1, {
          lng: action.payload.lng,
          lat: action.payload.lat,
          inactive,
          id: newStopId(),
        });
      } else {
        state.stops.splice(action.payload.index || state.stops.length, 0, {
          lng: action.payload.lng,
          lat: action.payload.lat,
          inactive,
          id: newStopId(),
        });
      }
    },

    // Stop has been changed.
    stopChanged: (
      state,
      action: PayloadAction<{
        index: number;
        lng: number;
        lat: number;
        inactive?: boolean;
        /** Should the stop be fit into the map? */
        fitIntoMap?: boolean;
      }>,
    ) => {
      dispatchEvent(new Event("stop-changed"));
      if (state.stops.length === 0) {
        resetRouting(state);
      }
      if (action.payload.index == 0) {
        state.currentPositionAsStart = false;
      }
      state.stops[action.payload.index].lng = action.payload.lng;
      state.stops[action.payload.index].lat = action.payload.lat;
      if (action.payload.inactive !== undefined) {
        state.stops[action.payload.index].inactive = action.payload.inactive;
      }
      if (action.payload.fitIntoMap) {
        state.fitPositionsIntoMap = [
          { lng: action.payload.lng, lat: action.payload.lat },
        ];
      }
    },

    // Stop has been reordered.
    stopReordered: (
      state,
      action: PayloadAction<{ from: number; to: number }>,
    ) => {
      const old = state.stops[action.payload.from];
      state.stops.splice(action.payload.from, 1);
      state.stops.splice(action.payload.to, 0, old);
    },

    // Stops have been reversed.
    stopsReversed: (state) => {
      state.stops.reverse();
    },

    // Stop has been removed.
    stopRemoved: (state, action: PayloadAction<number>) => {
      state.stops.splice(action.payload, 1);
    },

    // All stops have been removed.
    stopsResetted: (state) => {
      resetRouting(state);
      state.currentPositionAsStart = true;
    },

    // Users street preference has been changed.
    streetPreferenceChanged: (
      state,
      action: PayloadAction<{ id: keyof StreetPreferences; value: number }>,
    ) => {
      state.streetPreferences[action.payload.id] = action.payload.value;

      // const id = action.payload.id;
      // const oldValue = state.preferences[id];
      // const diff = (action.payload.value - oldValue) / 2;
      // for (const key of Object.keys(state.preferences)) {
      //   state.preferences[key as keyof StreetPreferences] = key === id ? action.payload.value :
      //     state.preferences[key as keyof StreetPreferences] - diff;
      // }
    },

    // Rating layer has been toggled.
    toggledRatingLayer: (state) => {
      state.ratingLayerActive = !state.ratingLayerActive;
    },

    // A route was calculated.
    routeCalculated: (state, action: PayloadAction<GeoJSON.GeoJSON>) => {
      dispatchEvent(new Event("route-calculated"));
      state.routeWay = action.payload;
    },

    // Segments of a route have been calculated.
    routeSegmentsCalculated: (
      state,
      action: PayloadAction<{
        segments: RouteSegment[];
        route: GeoJSON.GeoJSON;
      }>,
    ) => {
      state.routeSegments = action.payload.segments;
      state.routeWay = action.payload.route;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(switchedToRouting, (state, action) => {
      resetRouting(state);
      if (action.payload && action.payload.target) {
        state.stops[1].lng = action.payload.target.lng;
        state.stops[1].lat = action.payload.target.lat;
        state.stops[1].inactive = false;
      }
    });
    builder.addCase(switchedToWayAdding, (state, action) => {
      resetRouting(state);
      if (action.payload?.stops && action.payload.stops.length > 1) {
        state.stops = [];
        for (const coord of action.payload.stops) {
          state.stops.push({ inactive: false, id: newStopId(), ...coord });
        }
      }
    });
    builder.addCase(switchedToQuickWayRating, (state, action) => {
      resetRouting(state);
      if (action.payload?.stops && action.payload.stops.length > 1) {
        state.stops = [];
        for (const coord of action.payload.stops) {
          state.stops.push({ inactive: false, id: newStopId(), ...coord });
        }
      }
    });
    builder.addCase(closedQuickWayRating, (state) => {
      resetRouting(state);
    });
    builder.addCase(closedRouting, (state, _action) => {
      resetRouting(state);
    });
    builder.addCase(closedWayAdding, (state, _action) => {
      resetRouting(state);
    });
    builder.addCase(receivedDirections, (state, action) => {
      state.routeWay = action.payload.feature?.geometry;
    });

    builder.addCase(selectedLocation, (state, action) => {
      dispatchEvent(new Event("selected-location"));
      if (action.payload.changeCenter) {
        state.center = {
          lng: action.payload.location.center.lng,
          lat: action.payload.location.center.lat,
          updateView: true,
          zoom: 15,
          flyTo: false,
        };
      }
    });
  },
});

export const {
  canceledContextMenu,
  centerUpdated,
  enabledCurrentPositionAsStart,
  locatedPosition,
  readyToRender,
  requestedContextMenu,
  routeCalculated,
  routeSegmentsCalculated,
  stopAdded,
  stopChanged,
  stopRemoved,
  stopReordered,
  stopsResetted,
  stopsReversed,
  streetPreferenceChanged,
  toggledRatingLayer,
} = mapSlice.actions;
export const selectMapState = (state: RootState) => state.map;
export default mapSlice.reducer;
