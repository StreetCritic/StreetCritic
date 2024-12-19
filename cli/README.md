# Command line tools to work with StreetCritic

To compile / run the tools, you first have to install
[Rust](https://www.rust-lang.org/).

To list all available commands, run with `--help`.
$ cargo run -- --help

## merge-ratings-into-osm-planet (Experimental)

This command loads the ratings from the database and updates an OpenStreetMap
PBF so that it contains the ratings as tags.

Currently, the table `segment_sources` has to be updated for this. See the
DELETE/INSERT pair in [../database/import_transport_network.duckdb.sql](the
transport network import script) for that.
