import { z } from "zod"

/**
 * Schema for validating USPS ZIP code lookup responses
 * 
 * @remarks
 * This schema validates the response from USPS's ZIP code lookup service.
 * It ensures the response contains all required fields in the correct format.
 */
export const uspsZipLookupParser = z.object({
	/** Status of the ZIP code lookup request */
	resultStatus: z.string(),
	
	/** The 5-digit ZIP code that was looked up */
	zip5: z.string(),
	
	/** Primary city associated with the ZIP code */
	defaultCity: z.string(),
	
	/** State associated with the ZIP code */
	defaultState: z.string(),
	
	/** Type of address record (e.g., residential, commercial) */
	defaultRecordType: z.string(),
	
	/** List of all valid city/state combinations for this ZIP code */
	citiesList: z.array(
		z.object({
			city: z.string(),
			state: z.string()
		})
	),
	
	/** List of invalid or non-accepting city/state combinations */
	nonAcceptList: z.array(
		z.object({
			city: z.string(),
			state: z.string()
		})
	)
})

/**
 * Type definition for USPS ZIP code lookup response
 * 
 * @example
 * ```typescript
 * const response: UspsZipLookupParser = {
 *   resultStatus: "SUCCESS",
 *   zip5: "12345",
 *   defaultCity: "ANYTOWN",
 *   defaultState: "NY",
 *   defaultRecordType: "RESIDENTIAL",
 *   citiesList: [{ city: "ANYTOWN", state: "NY" }],
 *   nonAcceptList: []
 * }
 * ```
 */
export type UspsZipLookupParser = z.infer<typeof uspsZipLookupParser>

/**
 * Interface for city/state combination
 * Used in both citiesList and nonAcceptList
 */
interface CityState {
	city: string;
	state: string;
}

/**
 * Validates a USPS ZIP code lookup response
 * 
 * @param data - The raw response data from USPS
 * @returns Parsed and validated data
 * @throws Will throw an error if validation fails
 */
export function validateUspsResponse(data: unknown): UspsZipLookupParser {
	const result = uspsZipLookupParser.safeParse(data);
	if (!result.success) {
		throw new Error(`Invalid USPS response: ${result.error.message}`);
	}
	return result.data;
}

/**
 * Checks if a city/state combination is valid for a given ZIP code
 * 
 * @param zipData - The validated USPS ZIP code data
 * @param city - The city to check
 * @param state - The state to check
 * @returns boolean indicating if the combination is valid
 */
export function isValidCityState(
	zipData: UspsZipLookupParser,
	city: string,
	state: string
): boolean {
	return zipData.citiesList.some(
		entry => entry.city === city && entry.state === state
	);
}
