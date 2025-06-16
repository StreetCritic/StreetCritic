import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { Feature, LineString } from "geojson";
import { closedQuickWayRating, closedWayAdding } from "@/features/map/appSlice";
import { heightsToGains } from "../directions/geo";
import { stopsResetted } from "./mapSlice";

export type Directions = {
  feature: Feature<LineString>;
  distance: number;
  duration: number;
};

export type DirectionsState = {
  // Calculate the shortest route?
  useShortest: boolean;
  directions: Directions | null;
  /** Elevation gain of the calculated route. Positive and negative. */
  elevationGain: [number, number] | null;
};

const initialState: DirectionsState = {
  useShortest: false,
  directions: null,
  elevationGain: null,
};

export const directionsSlice = createSlice({
  name: "directions",
  initialState,
  reducers: {
    // Directions have been received.
    receivedDirections: (state, action: PayloadAction<Directions>) => {
      state.directions = action.payload;
    },
    /** Received heights. */
    receivedHeights: (state, action: PayloadAction<[[number, number]]>) => {
      state.elevationGain = heightsToGains(action.payload);
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
    builder.addMatcher(
      isAnyOf(stopsResetted, closedQuickWayRating, closedWayAdding),
      (state, _action) => {
        state.directions = null;
        state.elevationGain = null;
      },
    );
  },
});

export const {
  receivedDirections,
  receivedHeights,
  setUseShortest,
  toggledUseShortest,
} = directionsSlice.actions;
export const selectDirectionsState = (state: RootState) => state.directions;
export default directionsSlice.reducer;
