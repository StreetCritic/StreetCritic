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
  selectedWay: SelectedWay | null;
};

const initialState: LocationState = {
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
      }>,
    ) => {
      state.location = {
        center: action.payload.location.center,
        label: action.payload.location.label,
      };
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
