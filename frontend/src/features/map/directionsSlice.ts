import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { Feature, LineString } from "geojson";
import { closedRouting } from "@/features/map/appSlice";

export type Directions = {
  feature: Feature<LineString>;
  distance: number;
  duration: number;
};

export type DirectionsState = {
  // Calculate the shortest route?
  useShortest: boolean;
  directions: Directions | null;
};

const initialState: DirectionsState = {
  useShortest: false,
  directions: null,
};

export const directionsSlice = createSlice({
  name: "directions",
  initialState,
  reducers: {
    // Directions have been received.
    receivedDirections: (state, action: PayloadAction<Directions>) => {
      state.directions = action.payload;
    },
    // User toggled usage of shortest route.
    toggledUseShortest: (state) => {
      state.useShortest = !state.useShortest;
    },
    /** Shortest route option set. */
    setUseShortest: (state, action: PayloadAction<boolean>) => {
      state.useShortest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(closedRouting, (state, _action) => {
      state.directions = null;
    });
  },
});

export const { receivedDirections, setUseShortest, toggledUseShortest } =
  directionsSlice.actions;
export const selectDirectionsState = (state: RootState) => state.directions;
export default directionsSlice.reducer;
