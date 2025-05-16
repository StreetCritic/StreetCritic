# Map Tile Generation

Contained directories:

- tilemaker: Configurations for [tilemaker](https://tilemaker.org/)

## To generate indicator tiles:

```sh
tilemaker --input input.osm.pbf --output bikeability.mbtiles --config config-indicators.json --process process-indicators.lua
```

## To generate main openmaptiles tiles:

Run ./get-coastline.sh and ./get-landcover.sh before running tilemaker to fetch
sea tiles and small-scale landcover.


```sh
tilemaker  --input input.osm.pbf --output tiles.mbtiles --config config-openmaptiles.json --process process-openmaptiles.lua --bbox -180,-90,180,90 --store ~/tilemaker_tmp
```

### System requirements for full planet

- Takes about 2 hours on an AMD EPYC system with 48 cores, 192GB RAM, and NVMe SSD [Hetzner CCX63] (March 2025)
