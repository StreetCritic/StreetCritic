import { dispatchEvent, Event } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { LngLat } from "./types";

export enum AppMode {
  Browsing,
  Routing,
  WayAdding,
  QuickWayRating,
}

export type User = {
  // Display name.
  name: string;
};

export enum AuthenticationState {
  Unauthenticated,
  Authenticating,
  Authenticated,
  Error,
}

export type AppState = {
  // Main App operation
  mode: AppMode;

  // Locale for translations
  locale: string;

  // Authenticated user if present.
  user: User | null;

  // Authentication state.
  authState: AuthenticationState;

  /**
   * Is the announcement banner visible?
   */
  announcementBannerVisible: boolean;
};

const initialState: AppState = {
  mode: AppMode.Browsing,
  locale: "en",
  user: null,
  authState: AuthenticationState.Unauthenticated,
  announcementBannerVisible: localStorage.getItem("state") === null,
};

localStorage.setItem("state", "visited");

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /** User closed the announcement banner. */
    closedAnnouncementBanner: (state) => {
      state.announcementBannerVisible = false;
    },

    // User switched to way adding mode.
    switchedToWayAdding: (
      state,
      _action: PayloadAction<{ stops?: LngLat[] } | undefined>,
    ) => {
      dispatchEvent(new Event("switched-to-way-adding"));
      state.mode = AppMode.WayAdding;
    },

    // User switched to browsing mode.
    switchedToBrowsing: (state) => {
      dispatchEvent(new Event("switched-to-browsing"));
      state.mode = AppMode.Browsing;
    },

    /** User switched to quick way rating mode. */
    switchedToQuickWayRating: (
      state,
      _action: PayloadAction<{ stops?: LngLat[] } | undefined>,
    ) => {
      dispatchEvent(new Event("switched-to-quick-way-rating"));
      state.mode = AppMode.QuickWayRating;
    },

    // User switched to routing mode, possibly with target location.
    switchedToRouting: (
      state,
      _action: PayloadAction<
        { target?: { lng: number; lat: number } } | undefined
      >,
    ) => {
      dispatchEvent(new Event("switched-to-routing"));
      state.mode = AppMode.Routing;
    },

    // User was authenticated.
    userAuthenticated: (state, action: PayloadAction<User>) => {
      dispatchEvent(new Event("user-authenticated"));
      state.user = action.payload;
      state.authState = AuthenticationState.Authenticated;
    },

    // User closed routing mode.
    closedRouting: (state) => {
      state.mode = AppMode.Browsing;
    },

    // User closed quick way rating mode.
    closedQuickWayRating: (state) => {
      state.mode = AppMode.Browsing;
    },

    // User closed way adding mode.
    closedWayAdding: (state) => {
      state.mode = AppMode.Browsing;
    },
  },
});

export const {
  closedAnnouncementBanner,
  closedQuickWayRating,
  switchedToBrowsing,
  switchedToWayAdding,
  switchedToQuickWayRating,
  switchedToRouting,
  userAuthenticated,
  closedRouting,
  closedWayAdding,
} = appSlice.actions;
export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
