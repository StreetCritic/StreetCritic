import { dispatchEvent, Event } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { LngLat } from "./types";
import { findUILanguage } from "@/features/i18n";

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

  /**
   * Is a component in a loading state?
   */
  loading: Record<string, boolean>;
};

const initialState: AppState = {
  mode: AppMode.Browsing,
  locale: findUILanguage(),
  user: null,
  authState: AuthenticationState.Unauthenticated,
  announcementBannerVisible:
    typeof localStorage !== "undefined"
      ? localStorage.getItem("state") === null
      : true,
  loading: {},
};

if (typeof localStorage !== "undefined") {
  localStorage.setItem("state", "visited");
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /** User closed the announcement banner. */
    closedAnnouncementBanner: (state) => {
      state.announcementBannerVisible = false;
    },

    /** Component with id started loading something. */
    loadingStarted: (state, action: PayloadAction<string>) => {
      state.loading[action.payload] = true;
    },

    /** Component with id finished loading something. */
    loadingFinished: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
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
  loadingStarted,
  loadingFinished,
  switchedToBrowsing,
  switchedToWayAdding,
  switchedToQuickWayRating,
  switchedToRouting,
  userAuthenticated,
  closedRouting,
  closedWayAdding,
} = appSlice.actions;
export const selectAppState = (state: RootState) => state.app;

/**
 * Returns true if any component is loading something.
 */
export const selectIsLoading = (state: RootState) =>
  Object.values(state.app.loading).includes(true);
export default appSlice.reducer;
