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
      state.elevationGain = action.payload
        .reduce(
          ([lastHeight, sumUp, sumDown], [_, height]) => [
            height,
            height > lastHeight ? sumUp + height - lastHeight : sumUp,
            height < lastHeight ? sumDown + lastHeight - height : sumDown,
          ],
          [action.payload[0][1], 0, 0],
        )
        .slice(1);
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

export const {
  receivedDirections,
  receivedHeights,
  setUseShortest,
  toggledUseShortest,
} = directionsSlice.actions;
export const selectDirectionsState = (state: RootState) => state.directions;
export default directionsSlice.reducer;
