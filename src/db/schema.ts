import { sql } from "drizzle-orm";
import {
	text,
	integer,
	sqliteTable,
} from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Database schema for form submissions table
 * Stores user information, property details, and tracking data
 */
export const formSubmissions = sqliteTable("form_submissions", {
	// Primary identification
	id: integer("id").primaryKey({ autoIncrement: true }),

	// Contact information
	streetAddress: text("street_address"),
	city: text("city"),
	state: text("state"),
	zipCode: text("zip_code"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email"),
	phone: text("phone"),

	// Basic qualification data
	isHomeowner: integer("is_homeowner", { mode: "boolean" }),
	source: text("source", { enum: ["home_improvement"] }),
	shortTrade: text("short_trade"),
	action: text("action"),
	additionalType: text("additional_type"),

	// Technical tracking
	ipAddress: text("ip_address"),

	// Property information
	homeType: text("home_type", { 
		enum: ["single_family", "multi_family", "mobile_home", "other"] 
	}),
	utilityBill: integer("utility_bill"), // Monthly utility bill amount in dollars

	// Qualification metrics
	creditScore: text("credit_score", {
		enum: ["excellent", "good", "fair", "poor", "unknown"]
	}),

	// Solar-specific information
	roofShade: text("roof_shade", {
		enum: ["none", "partial", "full"]
	}),
	solarReason: text("solar_reason", {
		enum: ["save_money", "environment", "independence", "other"]
	}),
	roofType: text("roof_type", {
		enum: ["asphalt", "metal", "tile", "flat", "other"]
	}),
	projectType: text("project_type", {
		enum: ["residential", "commercial", "non_profit"]
	}),

	// Marketing attribution
	landingPage: text("landing_page"),    // URL where form was submitted
	placement: text("placement"),          // Location of form on page

	// UTM parameters for tracking marketing campaigns
	utmSource: text("utm_source"),        // Traffic source (e.g., google, facebook)
	utmMedium: text("utm_medium"),        // Marketing medium (e.g., cpc, email)
	utmCampaign: text("utm_campaign"),    // Campaign name
	utmTerm: text("utm_term"),            // Search terms used
	utmContent: text("utm_content"),      // Content variant identifier
	utmId: text("utm_id"),                // Campaign ID

	// Platform-specific tracking IDs
	fbclid: text("fbclid"),               // Facebook click identifier
	gclid: text("gclid"),                 // Google Ads click identifier

	// Device information
	deviceCategory: text("device_category", {
		enum: ["mobile", "desktop", "tablet"]
	}),

	// Metadata
	createdAt: integer("created_at", { mode: "timestamp_ms" })
});

// Generate Zod schema for type-safe form submissions
export const selectFormSubmissions = createSelectSchema(formSubmissions);

// TypeScript type for form submissions
export type SelectFormSubmissions = z.infer<typeof selectFormSubmissions>;
