import { z } from "zod"

export const uspsZipLookupParser = z.object({
	resultStatus: z.string(),
	zip5: z.string(),
	defaultCity: z.string(),
	defaultState: z.string(),
	defaultRecordType: z.string(),
	citiesList: z.array(z.object({ city: z.string(), state: z.string() })),
	nonAcceptList: z.array(z.object({ city: z.string(), state: z.string() }))
})

export type UspsZipLookupParser = z.infer<typeof uspsZipLookupParser>
