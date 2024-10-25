CREATE OR REPLACE
  FUNCTION function_zxy_query(z integer, x integer, y integer)
  RETURNS bytea AS $$
  DECLARE
  mvt bytea;
BEGIN
  SELECT INTO mvt ST_AsMVT(tile, 'function_zxy_query', 4096, 'geom') FROM (
    SELECT
      ST_AsMVTGeom(
        ST_Transform(ST_CurveToLine(geom), 3857),
        ST_TileEnvelope(z, x, y),
        -- last argument 'false' is important, as currently cutted geometries
        -- are not supported by Ibre
        4096, 64, false) AS geom,
      "class", "connectors"::TEXT, "id"
      FROM segment
     WHERE geom && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
  ) as tile WHERE geom IS NOT NULL;

  RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;

DO $do$ BEGIN
          EXECUTE 'COMMENT ON FUNCTION function_zxy_query IS $tj$' || $$
            {
              "description": "my new description",
              "attribution": "my attribution",
              "vector_layers": [
                {
                  "id": "segment",
                  "fields": {
                    "id": "bpchar",
                    "name": "text",
                    "connectors": "text"
                    }
                    }
                    ]
                    }
            $$::json || '$tj$';
        END $do$;
