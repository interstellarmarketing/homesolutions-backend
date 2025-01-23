DROP TABLE `submissions`;
DROP TABLE `users`;

CREATE TABLE `form_submissions` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `street_address` text,
    `city` text,
    `state` text,
    `zip_code` text,
    `first_name` text,
    `last_name` text,
    `email` text,
    `phone` text,
    `is_homeowner` integer,
    `source` text,
    `short_trade` text,
    `action` text,
    `additional_type` text,
    `created_at` integer
); 