ALTER TABLE `form_submissions` ADD `estimate_short_trade` text NOT NULL;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `estimate_action` text NOT NULL;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `estimate_type` text;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `wbraid` text;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `gbraid` text;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `ssn` text;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `trusted_form_cert_url` text;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `trusted_form_ping_url` text;--> statement-breakpoint
ALTER TABLE `form_submissions` DROP COLUMN `utm_id`;