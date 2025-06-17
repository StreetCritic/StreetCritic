import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { Geometry } from "geojson";

export type Location = {
  center: {
    lng: number;
    lat: number;
  };
  label: string | null;
};

export type SelectedWay = {
  geometry: Geometry;
  indicators?: {
    bikeComfort: number;
    bikeSafety: number;
    beauty: number;
  } | null;
};

export type LocationState = {
  location: Location | null;
  recentLocations: Location[];
  selectedWay: SelectedWay | null;
};

const initialState: LocationState = {
  recentLocations: [],
  location: null,
  selectedWay: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // Location has been set.
    selectedLocation: (
      state,
      action: PayloadAction<{
        location: Location;
        selectedWay?: SelectedWay;
        changeCenter?: boolean;
        /** Add the location to the recent locations list? */
        remember?: boolean;
        /** Sets this location as current location. Default true. */
        setLocation?: boolean;
      }>,
    ) => {
      if (action.payload.setLocation !== false) {
        state.location = {
          center: action.payload.location.center,
          label: action.payload.location.label,
        };
      }
      if (action.payload.remember) {
        const lastIndex = state.recentLocations.findIndex(
          (entry) => entry.label === action.payload.location.label,
        );
        if (lastIndex !== -1) {
          state.recentLocations.splice(lastIndex, 1);
        }
        state.recentLocations.unshift({
          center: action.payload.location.center,
          label: action.payload.location.label,
        });
        state.recentLocations = state.recentLocations.slice(0, 10);
      }
      state.selectedWay = action.payload.selectedWay || null;
    },
    clearedLocation: (state) => {
      state.location = null;
      state.selectedWay = null;
    },
  },
});

export const { clearedLocation, selectedLocation } = locationSlice.actions;
export const selectLocationState = (state: RootState) => state.location;
export default locationSlice.reducer;
