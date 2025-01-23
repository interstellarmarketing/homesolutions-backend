import { z } from "zod"

/**
 * Parser for form submissions with validation rules
 * Includes all fields that can be stored in the database
 */
export const formSubmissionParser = z.object({
	// Required contact information
	streetAddress: z.string().min(5).trim(),
	city: z.string().min(2).trim(),
	state: z.string().length(2).trim(),
	zipCode: z.string().length(5),
	firstName: z.string().min(2).trim(),
	lastName: z.string().min(2).trim(),
	email: z.string().email().trim(),
	phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/),

	// Required qualification fields
	isHomeowner: z.boolean(),
	source: z.literal("home_improvement"),
	shortTrade: z.string(),
	action: z.string(),
	additionalType: z.string().nullable(),

	// Optional property information
	homeType: z.enum(["single_family", "multi_family", "mobile_home", "other"]).nullable(),
	utilityBill: z.number().int().min(0).max(10000).nullable(),
	creditScore: z.enum(["excellent", "good", "fair", "poor", "unknown"]).nullable(),

	// Optional solar-specific fields
	roofShade: z.enum(["none", "partial", "full"]).nullable(),
	solarReason: z.enum(["save_money", "environment", "independence", "other"]).nullable(),
	roofType: z.enum(["asphalt", "metal", "tile", "flat", "other"]).nullable(),
	projectType: z.enum(["residential", "commercial", "non_profit"]).nullable(),

	// System fields (populated by backend)
	ipAddress: z.string(),
	deviceCategory: z.enum(["mobile", "desktop", "tablet"]),
	landingPage: z.string(),
	placement: z.string(),

	// Marketing attribution
	utmSource: z.string().nullable(),
	utmMedium: z.string().nullable(),
	utmCampaign: z.string().nullable(),
	utmTerm: z.string().nullable(),
	utmContent: z.string().nullable(),
	utmId: z.string().nullable(),
	fbclid: z.string().nullable(),
	gclid: z.string().nullable(),
})

export type FormSubmissionType = z.infer<typeof formSubmissionParser>
