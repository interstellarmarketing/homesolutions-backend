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
	shortTrade: z.string(),
	action: z.string(),
	additionalType: z.string().optional(),

	// Optional property information
	homeType: z.enum(["single_family", "multi_family", "mobile_home", "other"]).optional(),
	utilityBill: z.number().int().min(0).max(10000).optional(),
	creditScore: z.enum(["excellent", "good", "fair", "poor", "unknown"]).optional(),

	// Optional solar-specific fields
	roofShade: z.enum(["none", "partial", "full"]).optional(),
	roofType: z.enum(["asphalt", "cedar shake", "metal", "natural slate", "shingles", "tar", "tile", "other"]).optional(),
	solarReason: z.enum(["save_money", "environment", "independence", "other"]).optional(),
	projectType: z.enum(["residential", "commercial", "non_profit"]).optional(),

	// System fields (populated by backend)
	ipAddress: z.string().optional(),
	deviceCategory: z.enum(["mobile", "desktop", "tablet"]).optional(),

	// Marketing attribution
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
	utmTerm: z.string().optional(),
	utmContent: z.string().optional(),
	utmId: z.string().optional(),
	fbclid: z.string().optional(),
	gclid: z.string().optional(),
	wbraid: z.string().optional(),
	gbraid: z.string().optional(),
	ssn: z.string().optional(),
	trustedFormCertUrl: z.string().optional(),
	trustedFormPingUrl: z.string().optional(),
})

export type FormSubmissionType = z.infer<typeof formSubmissionParser>
