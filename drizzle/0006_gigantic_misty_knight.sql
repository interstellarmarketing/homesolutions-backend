CREATE TABLE `form_submissions_outbound` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`form_submission_id` integer,
	`api_url` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_code` integer,
	`response_message` text,
	`response_body` text,
	`error_message` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`form_submission_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE no action
);
