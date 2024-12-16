import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import {
  closedRouting,
  closedWayAdding,
  switchedToRouting,
  switchedToWayAdding,
} from "./appSlice";
import { receivedDirections } from "@/features/map/directionsSlice";

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

export type MapState = {
  // Map center.
  // If updateView is true, updates the map view once and sets this too false.
  center: { lng: number; lat: number; zoom: number; updateView: boolean };

  // Stops on the map.
  stops: { lng: number; lat: number; inactive: boolean; id: number }[];

  // Queried location
  locationQuery: string | null;

  // A displayed location marker.
  locationMarker: { lng: number; lat: number } | null;

  // The calculated way of a routing.
  routeWay: GeoJSON.GeoJSON | null;

  // The calculated segments of a route.
  routeSegments: RouteSegment[] | null;
};

const initialState: MapState = {
  center: config.defaultMapCenter,
  stops: [],
  locationQuery: null,
  locationMarker: null,
  routeWay: null,
  routeSegments: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    // Updates the map center.
    // Only updates map view if updateView is true.
    centerUpdated: (
      state,
      action: PayloadAction<{
        lng?: number;
        lat?: number;
        zoom?: number;
        updateView: boolean;
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
      state.center.updateView = action.payload.updateView;
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
      }>,
    ) => {
      state.stops[action.payload.index].lng = action.payload.lng;
      state.stops[action.payload.index].lat = action.payload.lat;
      if (action.payload.inactive !== undefined) {
        state.stops[action.payload.index].inactive = action.payload.inactive;
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
    },

    // User queried a location.
    queriedLocation: (state, action: PayloadAction<string>) => {
      state.locationQuery = action.payload;
    },

    // User cleared the queried a location.
    clearedQueriedLocation: (state) => {
      state.locationQuery = null;
    },

    // A route was calculated.
    routeCalculated: (state, action: PayloadAction<GeoJSON.GeoJSON>) => {
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

    // User selected a location.
    selectedLocation: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>,
    ) => {
      state.locationQuery = null;
      state.locationMarker = {
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
      state.center = {
        lng: action.payload.lng,
        lat: action.payload.lat,
        updateView: true,
        zoom: 15,
      };
    },

    // User changed the location marker.
    changedLocationMarker: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>,
    ) => {
      state.locationMarker = {
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(switchedToRouting, (state, _action) => {
      resetRouting(state);
    });
    builder.addCase(switchedToWayAdding, (state, _action) => {
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
  },
});

export const {
  centerUpdated,
  changedLocationMarker,
  clearedQueriedLocation,
  queriedLocation,
  routeCalculated,
  routeSegmentsCalculated,
  selectedLocation,
  stopAdded,
  stopChanged,
  stopRemoved,
  stopReordered,
  stopsResetted,
  stopsReversed,
} = mapSlice.actions;
export const selectMapState = (state: RootState) => state.map;
export default mapSlice.reducer;
