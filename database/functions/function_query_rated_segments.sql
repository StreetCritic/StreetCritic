-- TODO use rated_segments view
CREATE OR REPLACE
  FUNCTION function_query_rated_segments(z integer, x integer, y integer)
  RETURNS bytea AS $$
  DECLARE
  mvt bytea;
BEGIN
  SELECT INTO mvt ST_AsMVT(tile, 'function_query_rated_segments', 4096, 'geom') FROM (
    SELECT
      ST_AsMVTGeom(
        ST_Transform(ST_CurveToLine(
          ST_LineSubstring(geom, intervals._start, intervals._stop)
        ), 3857),
        ST_TileEnvelope(z, x, y),
        -- last argument 'false' is important, as currently cutted geometries
        -- are not supported by Ibre
        4096, 64, false) AS geom,
      intervals._rating
      FROM way_segment
           LEFT JOIN segment ON way_segment.segment_id = segment.id
           INNER JOIN  sc_get_stops_for_segment(way_segment.segment_id) AS intervals ON true
     WHERE geom && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
           -- SELECT
           --   ST_AsMVTGeom(
           --     ST_Transform(ST_CurveToLine(segment.geom), 3857),
           --     ST_TileEnvelope(z, x, y),
           --     -- last argument 'false' is important, as currently cutted geometries
           --     -- are not supported by Ibre
           --     4096, 64, false) AS geom,
           --   way_segment.id
           --   FROM way_segment
           --   LEFT JOIN segment
           --   ON way_segment.segment_id=segment.id
           --  WHERE geom && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
           --  GROUP BY segment.id
  ) as tile WHERE geom IS NOT NULL;
  RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;

DO $do$ BEGIN
          EXECUTE 'COMMENT ON FUNCTION function_query_rated_segments IS $tj$' || $$
            {
              "description": "Retrieves all rated segments in the given tile",
              "attribution": "StreetCritic.org",
              "vector_layers": [
                {
                  "id": "segment",
                  "fields": {
                    "id": "bpchar"
                    }
                    }
                    ]
                    }
            $$::json || '$tj$';
        END $do$;
