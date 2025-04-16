PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_form_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`posthog_person_id` text,
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
	`estimate_type` text,
	`ip_address` text,
	`home_type` text,
	`utility_bill` integer,
	`credit_score` integer,
	`landing_page` text,
	`roof_shade` text,
	`solar_reason` text,
	`roof_type` text,
	`project_type` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_content` text,
	`utm_term` text,
	`fbclid` text,
	`fbc` text,
	`fbp` text,
	`user_agent` text,
	`gclid` text,
	`wbraid` text,
	`gbraid` text,
	`ssn` text,
	`trusted_form_cert_url` text,
	`trusted_form_ping_url` text,
	`device_category` text,
	`created_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_form_submissions`("id", "posthog_person_id", "street_address", "city", "state", "zip_code", "first_name", "last_name", "email", "phone", "is_homeowner", "source", "short_trade", "action", "estimate_type", "ip_address", "home_type", "utility_bill", "credit_score", "landing_page", "roof_shade", "solar_reason", "roof_type", "project_type", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "fbc", "fbp", "user_agent", "gclid", "wbraid", "gbraid", "ssn", "trusted_form_cert_url", "trusted_form_ping_url", "device_category", "created_at") SELECT "id", "posthog_person_id", "street_address", "city", "state", "zip_code", "first_name", "last_name", "email", "phone", "is_homeowner", "source", "short_trade", "action", "estimate_type", "ip_address", "home_type", "utility_bill", "credit_score", "landing_page", "roof_shade", "solar_reason", "roof_type", "project_type", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "fbc", "fbp", "user_agent", "gclid", "wbraid", "gbraid", "ssn", "trusted_form_cert_url", "trusted_form_ping_url", "device_category", "created_at" FROM `form_submissions`;--> statement-breakpoint
DROP TABLE `form_submissions`;--> statement-breakpoint
ALTER TABLE `__new_form_submissions` RENAME TO `form_submissions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
