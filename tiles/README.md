# Map Tile Generation

Contained directories:

- tilemaker: Configurations for [tilemaker](https://tilemaker.org/)

## To generate indicator tiles:

```ssh
tilemaker  --input input.osm.pbf --output bikeability.mbtiles --config config-indicators.json --process process-indicators.lua
```

## To generate main openmaptiles tiles:

Run ./get-coastline.sh and ./get-landcover.sh before running tilemaker to fetch
sea tiles and small-scale landcover.

```ssh
tilemaker  --input input.osm.pbf --output tiles.mbtiles --config config-openmaptiles.json --process process-openmaptiles.lua
```
