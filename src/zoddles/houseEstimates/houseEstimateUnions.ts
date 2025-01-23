import { z } from "zod"

/**
 * Available trade types for home improvement services
 * @constant {readonly string[]}
 */
export const shortTradesConst = ["bathroom", "roofing", "siding", "windows"] as const;
export type ShortTradeEnum = typeof shortTradesConst[number];

/**
 * Zod schema for validating trade types
 */
export const shortTradeEnum = z.enum(shortTradesConst);

/**
 * Base schema for all estimate options
 */
export const estimateOption = z.object({
	estimateAction: z.enum(["replace", "repair"]),
	type: z.string().nullable(),
});

export type EstimateOption = z.infer<typeof estimateOption>

/**
 * Helper function to extend the base estimate schema with additional fields
 * @template T - Object containing Zod schemas for additional fields
 */
function extendEstimateOptionSchema<T extends Partial<Record<keyof EstimateOption, z.ZodType>>>(
	extension: T
) {
	return estimateOption.extend(extension);
}

/**
 * Trade-specific schemas and their corresponding options
 */
const TradeSchemas = {
	bathroom: z.object({
		shortTrade: z.literal("bathroom"),
		data: extendEstimateOptionSchema({
			type: z.null(),
			estimateAction: z.enum([
				"enclosure",
				"updates",
				"conversion",
				"remodel",
				"walk-in"
			]),
		}),
	}),
	
	roofing: z.object({
		shortTrade: z.literal("roofing"),
		data: extendEstimateOptionSchema({
			type: z.enum(["asphalt", "tile", "flat", "metal", "wood"]),
		}),
	}),
	
	siding: z.object({
		shortTrade: z.literal("siding"),
		data: extendEstimateOptionSchema({
			type: z.enum(["brickface", "metal", "stucco", "vinyl", "wood"]),
		}),
	}),
	
	windows: z.object({
		shortTrade: z.literal("windows"),
		data: extendEstimateOptionSchema({
			type: z.enum(["10+", "3-5", "6-9"]),
		}),
	}),
} as const;

/**
 * Union of all trade schemas for validation
 */
export const shortTradeDiscriminatedUnion = z.discriminatedUnion("shortTrade", [
	TradeSchemas.bathroom,
	TradeSchemas.roofing,
	TradeSchemas.siding,
	TradeSchemas.windows,
]);

export type ShortTradeDiscriminatedUnion = z.infer<typeof shortTradeDiscriminatedUnion>

/**
 * Helper types for working with trade data
 */
type ShortTradeDataMap = {
	[K in ShortTradeEnum]: {
		[P in keyof ShortTradeDiscriminatedUnion['data']]: P extends 'estimateAction' | 'type'
			? ShortTradeDiscriminatedUnion['data'][P][]
			: ShortTradeDiscriminatedUnion['data'][P];
	};
};

/**
 * Creates a type-safe trade object with its associated data
 */
function createShortTradeObject<K extends ShortTradeEnum>(
	shortTrade: K,
	data: ShortTradeDataMap[K]
): { shortTrade: K; data: ShortTradeDataMap[K] } {
	return { shortTrade, data };
}

/**
 * Validates a trade object against its schema
 */
export function parseShortTradeObject<K extends ShortTradeEnum>(
	obj: { shortTrade: K; data: ShortTradeDataMap[K] }
): ShortTradeDiscriminatedUnion {
	return shortTradeDiscriminatedUnion.parse(obj);
}

/**
 * Predefined trade objects with their available options
 */
export const shortTradeObjects = [
	createShortTradeObject("bathroom", {
		estimateAction: ["enclosure", "updates", "conversion", "remodel", "walk-in"],
		type: [null],
	}),
	createShortTradeObject("roofing", {
		estimateAction: ["replace", "repair"],
		type: ["asphalt", "tile", "flat", "metal", "wood"],
	}),
	createShortTradeObject("siding", {
		estimateAction: ["replace", "repair"],
		type: ["brickface", "metal", "stucco", "vinyl", "wood"],
	}),
	createShortTradeObject("windows", {
		estimateAction: ["replace", "repair"],
		type: ["10+", "3-5", "6-9"],
	}),
] as const;

/**
 * Schema for trade option descriptions used in the UI
 */
const tradeOptionDescriptionsParser = z.object({
	shortTrade: shortTradeEnum,
	actionDescription: z.string().optional(),
	typeDescription: z.string().optional(),
	shortTradeNoun: z.string().optional()
});

export type TradeOptionDescriptions = z.infer<typeof tradeOptionDescriptionsParser>

/**
 * UI descriptions for each trade type and their options
 */
export const tradeOptionDescriptions: TradeOptionDescriptions[] = [
	{
		shortTrade: "roofing",
		actionDescription: "Do you need to replace or repair an existing roof?",
		typeDescription: "What type of roof are you looking for?",
		shortTradeNoun: "roof"
	},
	{
		shortTrade: "bathroom",
		actionDescription: "Which of these best describe your needs?",
		typeDescription: "",
		shortTradeNoun: ""
	},
	{
		shortTrade: "windows",
		actionDescription: "Do you need to replace or repair existing windows?",
		typeDescription: "How many windows do you need replaced?",
		shortTradeNoun: ""
	},
	{
		shortTrade: "siding",
		actionDescription: "Service Needed",
		typeDescription: "Project Details",
		shortTradeNoun: ""
	}
];
