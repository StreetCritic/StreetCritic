use std::path::Path;

use anyhow;

use crate::process;

/// Calculates the scores for the ways in the PBF.
/// in_path: Path to the original PBF.
/// out_path: Path to the updated PBF.
pub fn calculate_way_scores(in_path: &Path, out_path: &Path) -> Result<(), anyhow::Error> {
    process::process(&process::Options {
        in_path,
        out_path,
        db_conn: None,
        merge_ratings: false,
        calculate_scores: true,
    })
}

/// Load the ratings from the database and merges them into the PBF.
/// in_path: Path to the original PBF.
/// out_path: Path to the updated PBF.
/// db: DB connection string.
pub fn merge_ratings_into_osm_planet(
    in_path: &Path,
    out_path: &Path,
    db: &str,
) -> Result<(), anyhow::Error> {
    process::process(&process::Options {
        in_path,
        out_path,
        db_conn: Some(db.into()),
        merge_ratings: true,
        calculate_scores: false,
    })
}
