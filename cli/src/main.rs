pub mod analysis;
pub mod commands;
pub mod db;
pub mod osm;

use clap::{Parser, Subcommand};
use log::LevelFilter;
use simple_logger::SimpleLogger;
use std::path::PathBuf;

#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    // /// Optional name to operate on
    // name: Option<String>,

    // /// Sets a custom config file
    // #[arg(short, long, value_name = "FILE")]
    // config: Option<PathBuf>,

    // /// Turn debugging information on
    // #[arg(short, long, action = clap::ArgAction::Count)]
    // debug: u8,
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Merges StreetCritic ratings into an OpenStreetMap planet PBF.
    MergeRatingsIntoOSMPlanet {
        // Path to the inplut planet PBF.
        #[arg(short, long)]
        input: PathBuf,

        // Path to the output planet PBF to.
        #[arg(short, long)]
        output: PathBuf,

        // Postgres connection string for StreetCritic database.
        #[arg(short, long)]
        db: String,
    },
}

fn main() -> Result<(), anyhow::Error> {
    let cli = Cli::parse();
    SimpleLogger::new().init()?;
    log::set_max_level(LevelFilter::Warn);
    match &cli.command {
        Some(Commands::MergeRatingsIntoOSMPlanet { input, output, db }) => {
            commands::merge_ratings_into_osm_planet(input, output, db)
        }
        None => Ok(()),
    }
}
