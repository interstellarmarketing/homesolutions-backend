import { z } from "zod"

export const estimateParser = z.object({
	streetAddress: z.string().min(5).trim(),
	city: z.string().min(2).trim(),
	state: z.string().length(2).trim(),
	zipCode: z.string().length(5),
	firstName: z.string().min(2).trim(),
	lastName: z.string().min(2).trim(),
	email: z.string().email().trim(),
	phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/),
	isHomeowner: z.boolean(),
	estimateShortTrade: z.string(),
	estimateAction: z.string(),
	estimateType: z.string().nullable()
})

export type EstimateStoreType = z.infer<typeof estimateParser>

