use crate::{internal_error, middleware::auth::User, ConnectionPool};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Extension, Json,
};
use geojson::de::deserialize_geometry;
use geojson::ser::serialize_geometry;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub mod db;

#[derive(TS)]
#[ts(export)]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct Way {
    id: u32,
    user_id: String,
    #[ts(as = "Vec<u8>")]
    datetime: time::PrimitiveDateTime,
    title: Option<String>,
    // comment: String,
    // mode: String,
    #[ts(type = "GeoJSON.Geometry")]
    #[serde(
        serialize_with = "serialize_geometry",
        deserialize_with = "deserialize_geometry"
    )]
    geometry: geo_types::Geometry<f64>,
}

pub async fn get_way(
    Path(way_id): Path<i32>,
    State(pool): State<ConnectionPool>,
) -> Result<Json<Way>, (StatusCode, String)> {
    let conn = pool.get().await.map_err(internal_error)?;
    let row = conn
        .query_one(
            r"
            SELECT *,
            (
                SELECT ST_AsGeoJSON(ST_Union(
                    CASE WHEN way_segment.start > way_segment.stop
                    THEN ST_LineSubstring(
                        ST_Reverse(segment.geom), way_segment.stop, way_segment.start)
                    ELSE ST_LineSubstring(
                        segment.geom, way_segment.start, way_segment.stop)
                    END)
                )
                FROM way_segment LEFT JOIN segment
                ON way_segment.segment_id=segment.id
                WHERE way_id=way.id
            ) AS geom
            FROM way
            WHERE id=$1
",
            &[&way_id],
        )
        .await
        .map_err(internal_error)?;

    let geom: &str = row.get("geom");
    let value = geom.parse::<geojson::GeoJson>().unwrap();
    let geometry: geojson::Geometry = value.try_into().unwrap();
    // let mls: geo_types::MultiLineString = geometry.try_into().unwrap();

    let way = Way {
        id: row.get::<_, i32>("id").try_into().unwrap(),
        // user_id: row.get("user_id"),
        user_id: "foo".into(),
        datetime: row.get("datetime"),
        title: row.get("title"),
        // mode: row.get("mode"),
        // comment: row.get("comment"),
        geometry: geometry.try_into().unwrap(),
    };
    Ok(Json(way))
}

/// Parameters for /ways endpoint.
#[derive(Deserialize)]
pub struct GetWaysParams {
    bbox: String,
}

/// Returns all ways in the given bounding box.
pub async fn get_ways(
    Query(params): Query<GetWaysParams>,
    State(pool): State<ConnectionPool>,
) -> Result<String, (StatusCode, String)> {
    let conn = pool.get().await.map_err(internal_error)?;

    // left bottom right top
    let bbox_coords: Vec<&str> = params.bbox.split(",").collect();
    let left: f64 = bbox_coords.get(0).unwrap().parse().unwrap();
    let bottom: f64 = bbox_coords.get(1).unwrap().parse().unwrap();
    let right: f64 = bbox_coords.get(2).unwrap().parse().unwrap();
    let top: f64 = bbox_coords.get(3).unwrap().parse().unwrap();

    let rows = conn
        .query(
            r"
            SELECT *,
            (
                SELECT ST_AsGeoJSON(ST_Union(
                    CASE WHEN way_segment.start > way_segment.stop
                    THEN ST_LineSubstring(
                        ST_Reverse(segment.geom), (1.0-way_segment.start), (1.0-way_segment.stop))
                    ELSE ST_LineSubstring(
                        segment.geom, way_segment.start, way_segment.stop)
                    END)
                )
                FROM way_segment LEFT JOIN segment
                ON way_segment.segment_id=segment.id
                WHERE way_id=way.id AND way_segment.start != way_segment.stop
            ) AS geom
            FROM way
            WHERE id IN
                (SELECT DISTINCT way_id FROM way_segment WHERE segment_id IN
                    (SELECT id FROM segment WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326))
                )
",
            &[&left, &bottom, &right, &top],
        )
        .await
        .map_err(internal_error)?;

    let mut ways = Vec::new();
    for row in &rows {
        let geom: &str = row.get("geom");
        let value = geom.parse::<geojson::GeoJson>().unwrap();
        let geometry: geojson::Geometry = value.try_into().unwrap();
        // let mls: geo_types::MultiLineString = geometry.try_into().unwrap();
        // let geometry = match value.value {
        //     geojson::Value::MultiLineString(g) => g,
        //     _ => continue,
        // };
        ways.push(Way {
            id: row.get::<_, i32>("id").try_into().unwrap(),
            // user_id: row.get("user_id"),
            user_id: "foo".into(),
            datetime: row.get("datetime"),
            title: row.get("title"),
            // mode: row.get("mode"),
            // comment: row.get("comment"),
            geometry: geometry.try_into().unwrap(),
        });
    }
    Ok(geojson::ser::to_feature_collection_string(&ways).unwrap())
}

/// Create a new way.
pub async fn create_way(
    Extension(user): Extension<User>,
    State(pool): State<ConnectionPool>,
    Json(payload): Json<CreateWay>,
) -> Result<Json<CreateWayResponse>, (StatusCode, String)> {
    let way_id = db::create_way(
        pool,
        &payload.segments,
        Some(payload.title),
        user.id.as_str(),
    )
    .await
    .map_err(internal_error)?;
    Ok(Json(CreateWayResponse { id: way_id }))
}

#[derive(Deserialize)]
pub struct Segment {
    id: String,
    start: f64,
    stop: f64,
}

/// Request object for the way create endpoint.
#[derive(Deserialize)]
pub struct CreateWay {
    segments: Vec<Segment>,
    title: String,
}

/// Response object for the way create endpoint.
#[derive(Serialize)]
pub struct CreateWayResponse {
    id: i32,
}
