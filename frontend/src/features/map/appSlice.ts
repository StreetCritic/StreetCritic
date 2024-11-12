import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export enum AppMode {
  Browsing,
  Routing,
  WayAdding,
}

export type AppState = {
  // Main App operation
  mode: AppMode;

  // Locale for translations
  locale: string;
};

const initialState: AppState = {
  mode: AppMode.WayAdding,
  locale: "en",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // User switched to way adding mode.
    switchedToWayAdding: (state) => {
      state.mode = AppMode.WayAdding;
    },

    // User switched to browsing mode.
    switchedToBrowsing: (state) => {
      state.mode = AppMode.Browsing;
    },
  },
});

export const { switchedToBrowsing, switchedToWayAdding } = appSlice.actions;
export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
