ATTACH 'dbname=streetcritic_api user=postgres host=127.0.0.1' AS db (TYPE POSTGRES, READ_ONLY);
ATTACH 'dbname=streetcritic_api' AS db (TYPE POSTGRES);
-- ATTACH 'dbname=streetcritic_overture_maps' AS db (TYPE POSTGRES);

INSERT INTO db.segment
SELECT
  id,
  names.primary as name,
  class,
  CAST(connectors AS json),
  -- NULL as sub_class,
  -- NULL as sub_class_rules,
  -- NULL as access_restrictions,
  -- NULL as level,
  -- NULL as level_rules,
  -- NULL as destinations,
  -- NULL as lanes,
  -- NULL as prohibited_transitions,
  -- NULL as road_surface,
  -- NULL as road_flags,
  -- NULL as speed_limits,
  -- NULL as width_rules,
  geometry as geom
  FROM read_parquet('./segment.parquet')
  WHERE subtype='road';
-- WHERE ST_CONTAINS(ST_MakeEnvelope(8.715388,50.092700,8.718917,50.094358), geometry)
-- LIMIT 1;

-- INSERT INTO db.connector
-- SELECT
--   id,
--   -- version,
--   geometry,
--   FROM read_parquet('./connector.parquet');

-- Fill the segment_sources table from Overture Maps data for segments that are
-- part of existing StreetCritic ways.
INSERT INTO db.segment_sources
SELECT
  id,
  sources,
  FROM read_parquet('./segment.parquet')
 WHERE subtype='road' AND id IN (
   SELECT segment_id FROM db.way_segment);
