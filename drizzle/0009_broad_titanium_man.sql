PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_form_submissions_outbound` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`posthog_person_id` text,
	`form_submission_id` integer,
	`api_url` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`request_body` text,
	`status_code` integer,
	`response_message` text,
	`response_body` text,
	`error_message` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`form_submission_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_form_submissions_outbound`("id", "posthog_person_id", "form_submission_id", "api_url", "status", "request_body", "status_code", "response_message", "response_body", "error_message", "created_at", "updated_at") SELECT "id", "posthog_person_id", "form_submission_id", "api_url", "status", "request_body", "status_code", "response_message", "response_body", "error_message", "created_at", "updated_at" FROM `form_submissions_outbound`;--> statement-breakpoint
DROP TABLE `form_submissions_outbound`;--> statement-breakpoint
ALTER TABLE `__new_form_submissions_outbound` RENAME TO `form_submissions_outbound`;--> statement-breakpoint
PRAGMA foreign_keys=ON;