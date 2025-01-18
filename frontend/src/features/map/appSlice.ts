import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export enum AppMode {
  Browsing,
  Routing,
  WayAdding,
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
};

const initialState: AppState = {
  mode: AppMode.Browsing,
  locale: "en",
  user: null,
  authState: AuthenticationState.Unauthenticated,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // User switched to way adding mode.
    switchedToWayAdding: (state) => {
      dispatchEvent(new Event("switched-to-way-adding"));
      state.mode = AppMode.WayAdding;
    },

    // User switched to browsing mode.
    switchedToBrowsing: (state) => {
      dispatchEvent(new Event("switched-to-browsing"));
      state.mode = AppMode.Browsing;
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

    // User closed way adding mode.
    closedWayAdding: (state) => {
      state.mode = AppMode.Browsing;
    },
  },
});

export const {
  switchedToBrowsing,
  switchedToWayAdding,
  switchedToRouting,
  userAuthenticated,
  closedRouting,
  closedWayAdding,
} = appSlice.actions;
export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
