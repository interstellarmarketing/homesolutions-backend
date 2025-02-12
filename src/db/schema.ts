import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Database schema for form submissions table
 * Stores user information, property details, and tracking data
 */
export const formSubmissions = sqliteTable('form_submissions', {
	// Primary identification
	id: integer('id').primaryKey({ autoIncrement: true }),

	// Contact information
	streetAddress: text('street_address'),
	city: text('city'),
	state: text('state'),
	zipCode: text('zip_code'),
	firstName: text('first_name'),
	lastName: text('last_name'),
	email: text('email'),
	phone: text('phone'),

	// Basic qualification data
	isHomeowner: integer('is_homeowner', { mode: 'boolean' }),
	source: text('source', { enum: ['home_improvement'] }),
	shortTrade: text('short_trade'),
	action: text('action'),
	estimateType: text('estimate_type'),

	// Technical tracking
	ipAddress: text('ip_address'),

	// Property information
	homeType: text('home_type', {
		enum: ['single_family', 'multi_family', 'mobile_home', 'other'],
	}),
	utilityBill: integer('utility_bill'), // Monthly utility bill amount in dollars

	// Qualification metrics
	creditScore: text('credit_score', {
		enum: ['excellent', 'good', 'fair', 'poor', 'unknown'],
	}),

	// Solar-specific information
	roofShade: text('roof_shade', {
		enum: ['none', 'partial', 'full'],
	}),
	solarReason: text('solar_reason', {
		enum: ['save_money', 'environment', 'independence', 'other'],
	}),
	roofType: text('roof_type', {
		enum: ['asphalt', 'cedar shake', 'metal', 'natural slate', 'shingles', 'tar', 'tile', 'other'],
	}),
	projectType: text('project_type', {
		enum: ['residential', 'commercial', 'non_profit'],
	}),

	// UTM parameters for tracking marketing campaigns
	utmSource: text('utm_source'),
	utmMedium: text('utm_medium'),
	utmCampaign: text('utm_campaign'),
	utmContent: text('utm_content'),
	utmTerm: text('utm_term'),
	fbclid: text('fbclid'),
	gclid: text('gclid'),
	wbraid: text('wbraid'), // New tracking parameter
	gbraid: text('gbraid'), // New tracking parameter
	ssn: text('ssn'), // New tracking parameter
	trustedFormCertUrl: text('trusted_form_cert_url'), // New tracking parameter
	trustedFormPingUrl: text('trusted_form_ping_url'), // New tracking parameter

	// Device information
	deviceCategory: text('device_category', {
		enum: ['mobile', 'desktop', 'tablet'],
	}),

	// Metadata
	createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

// Generate Zod schema for type-safe form submissions
export const selectFormSubmissions = createSelectSchema(formSubmissions);

// TypeScript type for form submissions
export type SelectFormSubmissions = z.infer<typeof selectFormSubmissions>;

export const formSubmissionsOutbound = sqliteTable('form_submissions_outbound', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	formSubmissionId: integer('form_submission_id').references(() => formSubmissions.id),

	apiUrl: text('api_url').notNull(),
	status: text('status', {
		enum: ['pending', 'success', 'failed'],
	})
		.notNull()
		.default('pending'),

	requestBody: text('request_body', { mode: 'json' }),

	// Response information
	statusCode: integer('status_code'),
	responseMessage: text('response_message'),
	responseBody: text('response_body'),

	// Error handling
	errorMessage: text('error_message'),

	// Timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' }),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});

export const selectFormSubmissionsOutbound = createSelectSchema(formSubmissionsOutbound);

export type SelectFormSubmissionsOutbound = z.infer<typeof selectFormSubmissionsOutbound>;
