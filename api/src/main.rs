use axum::{extract::Extension, http::StatusCode, routing::get, routing::post, Router};

use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use tokio_postgres::NoTls;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use tower_http::cors::CorsLayer;

pub mod config;
pub mod middleware;
pub mod rating;
pub mod way;

use rating::{create_rating, get_ratings};
use way::{create_way, get_way, get_ways};

use clap::Parser;

#[derive(Parser)]
#[command(version, about, long_about = None)]
struct CLIArguments {
    #[arg(short, long)]
    /// Config file path.
    config: String,
}

#[tokio::main]
async fn main() {
    let args = CLIArguments::parse();
    let config = config::parse(args.config.as_str());

    // initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_tokio_postgres=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // set up connection pool
    let manager = PostgresConnectionManager::new_from_stringlike(
        format!(
            "host={} port={} user={} password={}",
            config.database.host,
            config.database.port,
            config.database.user,
            config.database.password
        ),
        NoTls,
    )
    .unwrap();
    let pool = Pool::builder().build(manager).await.unwrap();

    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        // .route("/", get(root))
        // `POST /users` goes to `create_user`
        .route("/ratings", get(get_ratings).post(create_rating))
        // .route("/ratings/:id", get(get_rating))
        .route("/ways", get(get_ways).post(create_way))
        .route("/ways/:id", get(get_way))
        // .route_layer(axum::middleware::from_fn(middleware::auth::auth))
        .layer(Extension(config.access.token))
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind(format!(
        "{}:{}",
        config.server.listen_host, config.server.listen_port
    ))
    .await
    .unwrap();
    axum::serve(listener, app).await.unwrap();
}

type ConnectionPool = Pool<PostgresConnectionManager<NoTls>>;

/// Utility function for mapping any error into a `500 Internal Server Error`
/// response.
fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
