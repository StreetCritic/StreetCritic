import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { switchedToBrowsing } from "./appSlice";

export type MapState = {
  // Map center.
  center: { lng: number; lat: number };

  // Map zoom (integer).
  zoom: number;

  // Stops on the map.
  stops: { lng: number; lat: number }[];

  // Queried location
  locationQuery: string | null;

  // A displayed location marker.
  locationMarker: { lng: number; lat: number } | null;
};

const initialState: MapState = {
  center: { lng: 8.684966, lat: 50.110573 },
  zoom: 14,
  stops: [],
  locationQuery: null,
  locationMarker: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    // Updates the map center.
    centerUpdated: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>,
    ) => {
      state.center.lng = action.payload.lng;
      state.center.lat = action.payload.lat;
    },

    // Updates the map zoom (rounds to integer first).
    zoomUpdated: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },

    // Stop has been added.
    stopAdded: (
      state,
      action: PayloadAction<{ index: number; lng: number; lat: number }>,
    ) => {
      state.stops.splice(action.payload.index, 0, {
        lng: action.payload.lng,
        lat: action.payload.lat,
      });
    },

    // Stop has been changed.
    stopChanged: (
      state,
      action: PayloadAction<{ index: number; lng: number; lat: number }>,
    ) => {
      state.stops[action.payload.index].lng = action.payload.lng;
      state.stops[action.payload.index].lat = action.payload.lat;
    },

    // Stop has been removed.
    stopRemoved: (state, action: PayloadAction<number>) => {
      state.stops.splice(action.payload, 1);
    },

    // All stops have been removed.
    stopsResetted: (state) => {
      state.stops.length = 0;
    },

    // User queried a location.
    queriedLocation: (state, action: PayloadAction<string>) => {
      state.locationQuery = action.payload;
    },

    // User selected a location.
    selectedLocation: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>,
    ) => {
      state.locationQuery = "";
      state.locationMarker = {
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
      state.center = {
        lng: action.payload.lng,
        lat: action.payload.lat,
      };

      state.zoom = 15;
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
    builder.addCase(switchedToBrowsing, (state, action) => {
      state.stops.length = 0;
    });
  },
});

export const {
  centerUpdated,
  zoomUpdated,
  stopAdded,
  stopRemoved,
  stopChanged,
  stopsResetted,
  queriedLocation,
  selectedLocation,
  changedLocationMarker,
} = mapSlice.actions;
export const selectMapState = (state: RootState) => state.map;
export default mapSlice.reducer;
