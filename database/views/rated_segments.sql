-- Get all rated segments with their average rating.
-- TODO Don't just average the ratings.
CREATE OR REPLACE VIEW rated_segments AS
  SELECT
    way_segment.segment_id,
    CAST(AVG(intervals._rating) AS real) AS rating
    FROM way_segment
         LEFT JOIN segment ON way_segment.segment_id = segment.id
         INNER JOIN get_stops_for_segment(way_segment.segment_id) AS intervals ON true
   GROUP BY way_segment.segment_id;
