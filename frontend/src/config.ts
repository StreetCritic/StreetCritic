type Config = {
    // URL to the StreetCritic API
    apiURL: String;
    // Keycloak authority
    keycloakAuthority: String;
    // Keycloak redirect URI
    keycloakRedirectURI: String;
    // Keycloak client ID
    keycloakClientId: String;
    // URL to Valhalla routing service
    valhallaURL: String;
}

const config: Config = {
    apiURL: process.env.API_URL as string,
    keycloakAuthority: process.env.KEYCLOAK_AUTHORITY as string,
    keycloakRedirectURI: process.env.KEYCLOAK_REDIRECT_URI as string,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID as string,
    valhallaURL: process.env.VALHALLA_URL as string,
}

export default config;
