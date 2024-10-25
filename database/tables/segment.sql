CREATE TABLE segment (
  id CHAR(32) PRIMARY KEY NOT NULL,
  name TEXT,
  class TEXT,
  -- sub_class TEXT,
  -- sub_class_rules TEXT,
  -- access_restrictions TEXT,
  -- level INTEGER,
  -- level_rules TEXT,
  -- destinations TEXT,
  -- lanes TEXT,
  -- prohibited_transitions TEXT,
  -- road_surface TEXT,
  -- road_flags TEXT,
  -- speed_limits TEXT,
  -- width_rules TEXT,
  connectors jsonb,
  geom GEOMETRY(Geometry, 4326) NOT NULL
  -- geom GEOMETRY(LINESTRING, 4326)
);

CREATE INDEX segment_geom_idx
  ON segment
  USING GIST (geom);

CREATE TABLE segment_sources (
  segment_id CHAR(32) PRIMARY KEY NOT NULL,
  sources text
);
