import config from "@/config";

import {
  UserManager,
  Log,
  UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";
import { userAuthenticated } from "@/features/map/appSlice";
import { createContext } from "react";
import { Dispatch } from "@reduxjs/toolkit";

const settings: UserManagerSettings = {
  authority: config.keycloakAuthority,
  client_id: config.keycloakClientId,
  redirect_uri: config.keycloakRedirectURI,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // onSigninCallback: (_user: any): void => {
  // window.history.replaceState({}, document.title, window.location.pathname);
  // },
};

/**
 * Handles user authentication.
 */
export default class User {
  private userManager: UserManager;

  constructor() {
    this.userManager = new UserManager(settings);
  }

  /**
   * Redirects to user sign in.
   */
  signIn() {
    this.userManager.signinRedirect();
  }

  /**
   * Redirects to user registration.
   */
  register() {
    document.location.href = `${config.keycloakAuthority}/protocol/openid-connect/registrations?client_id=${config.keycloakClientId}&scope=openid%20profile&redirect_uri=${encodeURIComponent(config.keycloakRedirectURI)}&response_type=code`;
  }

  /**
   * Redirects to user sign out.
   */
  signOut() {
    this.userManager.signoutRedirect();
  }

  /**
   * Returns an access token for the user.
   */
  async getAccessToken(): Promise<string | null> {
    const user = await this.userManager.getUser();
    if (user) {
      return user.access_token;
    }
    return null;
  }

  /**
   * Callback for login page.
   */
  async signinCallback() {
    const user = await this.userManager.signinCallback(window.location.href);
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.assign("/");
    if (user) {
      this.userManager.storeUser(user);
    }
  }

  /**
   * Initialises authentication on app start, retrieves user if authenticated.
   */
  async initAuth(dispatch: Dispatch) {
    Log.setLogger(console);
    const user = await this.userManager.getUser();
    if (user) {
      const name = user.profile.preferred_username || "Unknown user";
      dispatch(userAuthenticated({ name }));
    }
  }
}

export const UserContext = createContext<User | null>(null);
