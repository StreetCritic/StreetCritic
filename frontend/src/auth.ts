import config from "@/config";

import { UserManager, Log } from "oidc-client-ts";
import { userAuthenticated } from "@/features/map/appSlice";

const oidcConfig = {
  authority: config.keycloakAuthority,
  client_id: config.keycloakClientId,
  redirect_uri: config.keycloakRedirectURI,
  // onSigninCallback: (_user: any): void => {
  // window.history.replaceState({}, document.title, window.location.pathname);
  // },
};

export function signIn() {
  const userManager = new UserManager(oidcConfig);
  userManager.signinRedirect();
}

export function signOut() {
  const userManager = new UserManager(oidcConfig);
  userManager.signoutRedirect();
}

export async function signinCallback() {
  const userManager = new UserManager(oidcConfig);
  const user = await userManager.signinCallback(window.location.href);
  console.log("signin", user);
  window.history.replaceState({}, document.title, window.location.pathname);
  window.location = "/";
  userManager.storeUser(user);
}

export async function initAuth(dispatch: any) {
  const userManager = new UserManager(oidcConfig);
  Log.setLogger(console);
  const user = await userManager.getUser();
  console.log("getUser", user);
  if (user) {
    const name = user.profile.name || "Unknown user";
    const accessToken = user.access_token || "";
    dispatch(userAuthenticated({ name, accessToken }));
  }
}

export { oidcConfig };
