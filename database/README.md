## Download Overture Maps data

Needs about 21G for connectors and 72G for segments (Overture Maps release
2024-08-20.0).

```sh
overturemaps download -f geoparquet -o segment.parquet -t segment --bbox=8.403168,49.991629,9.056854,50.209428
overturemaps download -f geoparquet -o connector.parquet -t connector --bbox=8.403168,49.991629,9.056854,50.209428
```
About 200G:
`import_transport_network.duckdb.sql`

Uses extra space: Create indexes *after* this!

select updategeometrysrid('connector', 'geometry', 4326);
select updategeometrysrid('segment', 'geom', 4326);
