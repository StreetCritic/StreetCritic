use serde::Deserialize;

/// The application configuration.
#[derive(Deserialize, Clone)]
pub struct Config {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub access: AccessConfig,
}

#[derive(Deserialize, Clone)]
pub struct ServerConfig {
    pub listen_host: String,
    pub listen_port: u16,
}

#[derive(Deserialize, Clone)]
pub struct DatabaseConfig {
    pub host: String,
    pub port: u16,
    pub name: String,
    pub user: String,
    pub password: String,
}

#[derive(Deserialize, Clone)]
pub struct AccessConfig {
    pub token: TokenConfig,
}

#[derive(Deserialize, Clone)]
pub struct TokenConfig {
    pub issuer: String,
    pub audience: String,
    pub sign_public_key: String,
}

/// Parse the configuration file at the given path.
pub fn parse(path: &str) -> Config {
    let content = std::fs::read_to_string(path).unwrap();
    let config: Config = toml::from_str(content.as_str()).unwrap();
    config
}
