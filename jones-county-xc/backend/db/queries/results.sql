-- name: ListResults :many
SELECT id, athlete_id, meet_id, time, place, created_at FROM results
ORDER BY created_at DESC;

-- name: GetResult :one
SELECT * FROM results WHERE id = ?;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);

-- name: UpdateResult :exec
UPDATE results
SET time = ?, place = ?
WHERE id = ?;

-- name: DeleteResult :exec
DELETE FROM results WHERE id = ?;

-- name: GetResultsByMeet :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.time,
    r.place,
    r.created_at
FROM results r
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: GetResultsByAthlete :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.time,
    r.place,
    r.created_at
FROM results r
WHERE r.athlete_id = ?
ORDER BY r.created_at DESC;

-- name: GetMostRecentMeetResults :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.time,
    r.place,
    r.created_at
FROM results r
JOIN meets m ON r.meet_id = m.id
WHERE m.date = (SELECT MAX(date) FROM meets)
ORDER BY r.place;
