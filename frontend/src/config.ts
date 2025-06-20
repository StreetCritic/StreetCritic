import { MapState } from "./features/map/mapSlice";

/**
 * The application configuration that is parsed from the .env file.
 */
type Config = {
  // URL to the StreetCritic API
  apiURL: string;
  /** Base URL of the instance without trailing slash. */
  baseURL: string;
  // Keycloak authority
  keycloakAuthority: string;
  // Keycloak redirect URI
  keycloakRedirectURI: string;
  // Keycloak client ID
  keycloakClientId: string;
  // URL to Valhalla routing service
  valhallaURL: string;
  // URL to location search service
  locationSearchURL: string;
  // URL to the transport tiles service
  transportTilesURL: string;
  // URL to the rated segments tiles
  ratedSegmentsURL: string;
  defaultMapCenter: MapState["center"];
  // Development mode.
  development: boolean;
};

const config: Config = {
  apiURL: process.env.API_URL as string,
  baseURL: process.env.BASE_URL as string,
  keycloakAuthority: process.env.KEYCLOAK_AUTHORITY as string,
  keycloakRedirectURI: process.env.KEYCLOAK_REDIRECT_URI as string,
  keycloakClientId: process.env.KEYCLOAK_CLIENT_ID as string,
  valhallaURL: process.env.VALHALLA_URL as string,
  locationSearchURL: process.env.LOCATION_SEARCH_URL as string,
  transportTilesURL: process.env.TRANSPORT_TILES_URL as string,
  ratedSegmentsURL: process.env.RATED_SEGMENTS_URL as string,
  defaultMapCenter: {
    zoom: 0.0,
    lng: 0.0,
    lat: 0.0,
    updateView: false,
    flyTo: false,
  },
  development: (process.env.DEVELOPMENT as string).toLowerCase() == "true",
};

export default config;
