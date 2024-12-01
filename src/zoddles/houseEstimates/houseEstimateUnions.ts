import { z } from "zod"

export const shortTradesConst = ["bathroom", "roofing", "siding", "windows"] as const;

export const shortTradeEnum = z.enum(shortTradesConst);
export type ShortTradeEnum = z.infer<typeof shortTradeEnum>

export const estimateOption = z.object({
	estimateAction: z.enum(["replace", "repair"]),
	type: z.string().nullable(),
});

export type EstimateOption = z.infer<typeof estimateOption>


// INFO: utility for typesafe overwriting of existings fields
// as well as arbitrary new fields
function extendEstimateOptionSchema<T extends { [K in keyof EstimateOption]?: z.ZodType<any, any, any> }>(
	extension: T
) {
	return estimateOption.extend(extension);
}



// INFO: default `estimateAction` === ["repair", "replace"]
export const shortTradeDiscriminatedUnion = z.discriminatedUnion("shortTrade", [
	z.object({
		shortTrade: z.literal<ShortTradeEnum>("bathroom"),
		data: extendEstimateOptionSchema({
			type: z.null(),
			estimateAction: z.enum(["enclosure", "updates", "conversion", "remodel", "walk-in"]),
		}),
	}),
	z.object({
		shortTrade: z.literal<ShortTradeEnum>("roofing"),
		data: extendEstimateOptionSchema({
			type: z.enum(["asphalt", "tile", "flat", "metal", "wood"]),
		}),
	}),
	z.object({
		shortTrade: z.literal<ShortTradeEnum>("siding"),
		data: extendEstimateOptionSchema({
			type: z.enum(["brickface", "metal", "stucco", "vinyl", "wood"]),
		}),
	}),
	z.object({
		shortTrade: z.literal<ShortTradeEnum>("windows"),
		data: extendEstimateOptionSchema({
			type: z.enum(["10+", "3-5", "6-9"]),
		}),
	}),
]);

export type ShortTradeDiscriminatedUnion = z.infer<typeof shortTradeDiscriminatedUnion>

type ShortTradeSchemaType = z.infer<typeof shortTradeDiscriminatedUnion>;

type ShortTradeFields<T extends ShortTradeEnum> = keyof ShortTradeSchemaType["data"];

type ShortTradeDataMap = {
	[K in ShortTradeEnum]: {
		[P in keyof z.infer<typeof shortTradeDiscriminatedUnion>['data']]:
		P extends 'estimateAction' | 'type'
		? z.infer<typeof shortTradeDiscriminatedUnion>['data'][P][]
		: z.infer<typeof shortTradeDiscriminatedUnion>['data'][P];
	};
};

function createShortTradeObject<K extends ShortTradeEnum>(
	shortTrade: K,
	data: ShortTradeDataMap[K]
): { shortTrade: K; data: ShortTradeDataMap[K] } {
	return { shortTrade, data };
}

export function parseShortTradeObject<K extends ShortTradeEnum>(
	obj: { shortTrade: K; data: ShortTradeDataMap[K] }
): ShortTradeDiscriminatedUnion {
	return shortTradeDiscriminatedUnion.parse(obj);
}

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
];

const tradeOptionDescriptionsParser = z.object({
	shortTrade: shortTradeEnum,
	actionDescription: z.string().optional(),
	typeDescription: z.string().optional(),
	shortTradeNoun: z.string().optional()
})

export type TradeOptionDescriptions = z.infer<typeof tradeOptionDescriptionsParser>

export const tradeOptionDescriptions: TradeOptionDescriptions[] = [{
	shortTrade: "roofing",
	actionDescription: "Do you need to replace or repair an existing roof?",
	typeDescription: "What type of roof are you looking for?",
	shortTradeNoun: "roof"
}, {
	shortTrade: "bathroom",
	actionDescription: "Which of these best describe your needs?",
	typeDescription: "",
	shortTradeNoun: ""
}, {
	shortTrade: "windows",
	actionDescription: "Do you need to replace or repair existing windows?",
	typeDescription: "How many windows do you need replaced?",
	shortTradeNoun: ""
}, {
	shortTrade: "siding",
	actionDescription: "Service Needed",
	typeDescription: "Project Details",
	shortTradeNoun: ""
}]
