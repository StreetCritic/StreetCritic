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
  // Access token for API.
  accessToken: string;
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

import { init } from "@/auth";

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
      state.mode = AppMode.WayAdding;
    },

    // User switched to browsing mode.
    switchedToBrowsing: (state) => {
      state.mode = AppMode.Browsing;
    },

    // User was authenticated.
    userAuthenticated: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authState = AuthenticationState.Authenticated;
    },
  },
});

export const { switchedToBrowsing, switchedToWayAdding, userAuthenticated } =
  appSlice.actions;
export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
