import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { Feature } from "geojson";
import { closedRouting } from "@/features/map/appSlice";

export type Directions = {
  feature: Feature;
  distance: number;
  duration: number;
};

export type DirectionsState = {
  directions: Directions | null;
};

const initialState: DirectionsState = {
  directions: null,
};

export const mapSlice = createSlice({
  name: "directions",
  initialState,
  reducers: {
    receivedDirections: (state, action: PayloadAction<Directions>) => {
      state.directions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(closedRouting, (state, _action) => {
      state.directions = null;
    });
  },
});

export const { receivedDirections } = mapSlice.actions;
export const selectDirectionsState = (state: RootState) => state.directions;
export default mapSlice.reducer;
