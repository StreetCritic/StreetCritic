-- For the given segment, return all rated intervals.
CREATE OR REPLACE FUNCTION get_stops_for_segment(_the_segment CHAR(32))
  RETURNS TABLE (_start DOUBLE PRECISION, _stop DOUBLE PRECISION, _rating NUMERIC)
  LANGUAGE PLPGSQL
AS $$
BEGIN
  RETURN QUERY
    WITH RECURSIVE
    -- Get all way segments, ignore the ones without rating.
    start_stops AS (
      SELECT start, stop, AVG(way_rating.rating) AS rating
        FROM way_segment LEFT JOIN way_rating
                             ON way_segment.way_id=way_rating.way_id
       WHERE segment_id=_the_segment AND way_rating.rating IS NOT NULL
       GROUP BY start, stop
    ),
    -- Get all the start/stops (in the following referred to as stops):
    -- We don't need to distinguish the direction of a way, so combine them to one
    -- column.
    combined_stops AS (
      SELECT stop FROM (
        SELECT start AS stop FROM start_stops
         UNION
        SELECT stop FROM start_stops
      ) as foo ORDER BY stop
    ),
    -- Construct the intervals based on the stops.
    intervals(istart, istop) AS (
      WITH ordered AS (SELECT stop FROM combined_stops ORDER BY stop LIMIT 2)
      SELECT MIN(stop), MAX(stop) FROM ordered
       UNION
      SELECT istop, (SELECT MIN(stop) FROM combined_stops WHERE stop > istop) as istop
        FROM intervals
       WHERE istop IS NOT NULL
    ),
    -- Remove intervals with empty stop.
    cleaned_intervals AS (
      SELECT * from intervals WHERE istop IS NOT NULL
    )
    SELECT istart, istop, (
      SELECT AVG(rating) FROM start_stops WHERE start <= istart AND stop >= istop
    ) AS rating FROM cleaned_intervals;
END;
$$;
