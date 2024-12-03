import { MapState } from "./features/map/mapSlice";

/**
 * The application configuration that is parsed from the .env file.
 */
type Config = {
  // URL to the StreetCritic API
  apiURL: string;
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
};

const config: Config = {
  apiURL: process.env.API_URL as string,
  keycloakAuthority: process.env.KEYCLOAK_AUTHORITY as string,
  keycloakRedirectURI: process.env.KEYCLOAK_REDIRECT_URI as string,
  keycloakClientId: process.env.KEYCLOAK_CLIENT_ID as string,
  valhallaURL: process.env.VALHALLA_URL as string,
  locationSearchURL: process.env.LOCATION_SEARCH_URL as string,
  transportTilesURL: process.env.TRANSPORT_TILES_URL as string,
  ratedSegmentsURL: process.env.RATED_SEGMENTS_URL as string,
  defaultMapCenter: {
    zoom: 14,
    lng: 8.684966,
    lat: 50.110573,
    updateView: false,
  },
};

export default config;
