BEGIN;
  \i tables/account.sql
  \i tables/segment.sql
  \i tables/way.sql
  \i functions/get_stops_for_segment.sql
  \i functions/function_zxy_query.sql
  \i views/rated_segments.sql
END;

-- CREATE TYPE route_rating_category AS ENUM ('beauty', 'bicycle_safety', 'wheelchair_safety', 'pedestrian_safety', 'bicycle_comfort', 'wheelchair_comfort', 'pedestrian_comfort');

-- CREATE TABLE segment_connector (
--   segment_id CHAR(32) NOT NULL,
--   connector_id CHAR(32) NOT NULL,
--   at INTEGER NOT NULL CHECK (at >= 0 AND at <= 0),
--   PRIMARY KEY(segment_id, connector_id, at)
-- );

-- CREATE TABLE connector (
--   id CHAR(32) PRIMARY KEY NOT NULL,
--   -- version INTEGER NOT NULL,
--   geometry GEOMETRY(Geometry, 4326) NOT NULL
--   -- geometry GEOMETRY(POINT, 4326) NOT NULL
-- );

-- CREATE INDEX connector_geom_idx
--   ON connector
--   USING GIST (geometry);

