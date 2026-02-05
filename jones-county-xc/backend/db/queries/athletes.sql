-- name: GetAthlete :one
SELECT * FROM athletes WHERE id = ?;

-- name: ListAthletes :many
SELECT * FROM athletes ORDER BY name;

-- name: ListAthletesByGrade :many
SELECT * FROM athletes WHERE grade = ? ORDER BY name;

-- name: CreateAthlete :execresult
INSERT INTO athletes (name, grade, personal_record, events)
VALUES (?, ?, ?, ?);

-- name: UpdateAthlete :exec
UPDATE athletes
SET name = ?, grade = ?, personal_record = ?, events = ?
WHERE id = ?;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- name: GetFastestPRs :many
SELECT * FROM athletes
WHERE personal_record IS NOT NULL
ORDER BY personal_record ASC
LIMIT ?;
