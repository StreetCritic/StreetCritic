import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export type Location = {
  center: {
    lng: number;
    lat: number;
  };
  label: string | null;
};

export type LocationState = {
  location: Location | null;
};

const initialState: LocationState = {
  location: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // Location has been set.
    selectedLocation: (state, action: PayloadAction<Location>) => {
      state.location = {
        center: action.payload.center,
        label: action.payload.label,
      };
    },
    clearedLocation: (state) => {
      state.location = null;
    },
  },
});

export const { clearedLocation, selectedLocation } = locationSlice.actions;
export const selectLocationState = (state: RootState) => state.location;
export default locationSlice.reducer;
