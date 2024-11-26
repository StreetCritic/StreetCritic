CREATE TABLE way (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES account(id),
  datetime TIMESTAMP,
  title TEXT,
  comment TEXT
);

CREATE TABLE way_rating (
  id SERIAL PRIMARY KEY,
  way_id INTEGER REFERENCES way(id),
  followup_to INTEGER REFERENCES way_rating(id),
  user_id INTEGER REFERENCES account(id),
  datetime TIMESTAMP,
  title TEXT,
  comment TEXT,
  general_rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  safety_rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  comfort_rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  beauty_rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
);

CREATE TABLE way_rating_votes (
  way_rating_id INTEGER REFERENCES way_rating(id),
  user_id INTEGER REFERENCES account(id),
  upvote BOOLEAN NOT NULL,
  datetime TIMESTAMP,
  PRIMARY KEY(way_rating_id, user_id)
);

CREATE TABLE way_rating_tag (
  id SERIAL PRIMARY KEY,
  way_rating_id INTEGER REFERENCES way_rating(id),
  name TEXT
  -- weight INTEGER NOT NULL CHECK (weight >= -10 AND weight <= 10 AND weight != 0)
);

-- CREATE TABLE route_rating_values (
--   id SERIAL PRIMARY KEY,
--   route_rating_id INTEGER REFERENCES route_rating(id),
--   category route_rating_category,
-- );

CREATE TABLE way_segment (
  id SERIAL PRIMARY KEY,
  way_id INTEGER REFERENCES way(id),
  segment_id CHAR(32) NOT NULL,
  start DOUBLE PRECISION NOT NULL CHECK (start >= 0 AND start <= 1),
  stop DOUBLE PRECISION NOT NULL CHECK (stop >= 0 AND stop <= 1)
);
