-- name: GetMeet :one
SELECT * FROM meets WHERE id = ?;

-- name: ListMeets :many
SELECT * FROM meets ORDER BY date DESC;

-- name: ListUpcomingMeets :many
SELECT * FROM meets WHERE date >= CURDATE() ORDER BY date;

-- name: CreateMeet :execresult
INSERT INTO meets (name, date, location, description)
VALUES (?, ?, ?, ?);

-- name: UpdateMeet :exec
UPDATE meets
SET name = ?, date = ?, location = ?, description = ?
WHERE id = ?;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;
