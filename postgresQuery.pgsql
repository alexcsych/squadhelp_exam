SELECT role, count(*)
FROM "Users"
GROUP BY role;

UPDATE "Users"
SET balance = balance + (0.1 * prizeTotal.total)
FROM (
    SELECT "userId", SUM(prize) AS total
    FROM "Contests"
    WHERE 
    EXTRACT(MONTH FROM "createdAt") >= 12 OR EXTRACT(MONTH FROM "createdAt") <=1  AND
    EXTRACT(DAY FROM "createdAt") >= 25 OR EXTRACT(DAY FROM "createdAt") <= 14 
    GROUP BY "userId"
) AS prizeTotal
WHERE role = 'customer' AND "Users"."id" = prizeTotal."userId";

UPDATE "Users"
SET balance = balance + 10
WHERE id IN (
    SELECT id
    FROM "Users"
    WHERE role = 'creator'
    ORDER BY rating DESC
    LIMIT 3
);