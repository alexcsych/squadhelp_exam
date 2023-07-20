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

CREATE TABLE "Conversations" (
  id SERIAL PRIMARY KEY,
  participants INTEGER[] NOT NULL,
  blackList BOOLEAN[],
  favoriteList BOOLEAN[]
);

CREATE TABLE "Messages" (
  id SERIAL PRIMARY KEY,
  sender INTEGER REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  body TEXT NOT NULL,
  conversation INTEGER REFERENCES "Conversations"(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO "Conversations"(participants, blackList, favoriteList)
VALUES  (ARRAY[2,3], ARRAY[FALSE,FALSE], ARRAY[TRUE,TRUE]),
        (ARRAY[2,5], ARRAY[FALSE,FALSE], ARRAY[TRUE,FALSE]),
        (ARRAY[4,5], ARRAY[FALSE,FALSE], ARRAY[FALSE,FALSE]);

INSERT INTO "Messages"(sender, body, conversation)
VALUES (2, 'Ку' , 1),
       (3, 'Как дела?' , 1),
       (2, 'Норм. Когда зарплата?' , 1),
       (3, 'Скоро)' , 1),
       (2, 'Привет' , 2),
       (5, 'Ага' , 2),
       (5, 'Доров' , 3),
       (4, 'Дорова' , 3),
       (2, 'Салам' , 1),
       (3,'Вышел я как то на улицу...' , 1);