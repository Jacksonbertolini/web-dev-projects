-- Sample Data for Jones County XC Database

-- 5 Athletes from Jones County
INSERT INTO athletes (name, grade, personal_record, events) VALUES
('Marcus Johnson', 12, '16:42', '5K, 1600m, 800m'),
('Tyler Williams', 11, '17:15', '5K, 3200m'),
('Emma Richardson', 10, '19:03', '5K, 1600m'),
('Jake Morrison', 9, '18:47', '5K'),
('Aaliyah Carter', 11, '17:58', '5K, 1600m, 800m');

-- 3 Upcoming Meets in Georgia
INSERT INTO meets (name, date, location, description) VALUES
('Peach State Invitational', '2026-02-14', 'Heritage Park, Macon, GA',
 'Annual invitational featuring teams from central Georgia. 5K course with rolling hills.'),
('Lake Oconee Classic', '2026-02-21', 'Lake Oconee, Greensboro, GA',
 'Scenic lakeside course. Fast and flat, great for PRs.'),
('GHSA Region 4-AAAA Championship', '2026-02-28', 'Panther Creek State Park, Stockbridge, GA',
 'Regional championship meet. Top 4 teams advance to state.');

-- Sample Results (connecting athletes to meets)
-- Peach State Invitational results
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
(1, 1, '16:58', 3),
(2, 1, '17:32', 8),
(3, 1, '19:21', 24),
(4, 1, '19:05', 19),
(5, 1, '18:12', 12);

-- Lake Oconee Classic results
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
(1, 2, '16:45', 2),
(2, 2, '17:18', 5),
(3, 2, '19:15', 21),
(5, 2, '17:55', 9);

-- Region Championship results (Jake missed due to injury)
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
(1, 3, '16:38', 1),
(2, 3, '17:28', 6),
(3, 3, '18:52', 18),
(5, 3, '18:05', 11);
