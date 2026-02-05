-- Common Queries for Jones County XC Database

-- 1. Get all athletes sorted by grade (seniors first)
SELECT name, grade, personal_record, events
FROM athletes
ORDER BY grade DESC, name;

-- 2. Get the top 5 fastest personal records
SELECT name, grade, personal_record
FROM athletes
WHERE personal_record IS NOT NULL
ORDER BY personal_record ASC
LIMIT 5;

-- 3. Get all results for the most recent meet
SELECT
    a.name AS athlete,
    m.name AS meet,
    m.date,
    r.time,
    r.place
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
WHERE m.date = (SELECT MAX(date) FROM meets)
ORDER BY r.place;

-- 4. Get an athlete's complete race history (example: Marcus Johnson)
SELECT
    m.name AS meet,
    m.date,
    m.location,
    r.time,
    r.place
FROM results r
JOIN meets m ON r.meet_id = m.id
JOIN athletes a ON r.athlete_id = a.id
WHERE a.name = 'Marcus Johnson'
ORDER BY m.date;
