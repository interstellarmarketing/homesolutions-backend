CREATE TABLE `submissions` (
	`sub_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sub_source` text,
	`sub_short_trade` text,
	`sub_action` text,
	`sub_addtl_type` text,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`street_address` text,
	`city` text,
	`state` text,
	`zip_code` text,
	`first_name` text,
	`last_name` text,
	`email` text,
	`phone` text,
	`isHomeowner` integer,
	`createdAt` integer
);
