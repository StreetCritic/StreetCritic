# Map Tile Generation

Contained directories:

- tilemaker: Configurations for [tilemaker](https://tilemaker.org/)


To generate bikeability tiles:

```ssh
tilemaker  --input input.osm.pbf --output bikeability.mbtiles --config config-bikeability.json --process process-bikeability.lua
```
