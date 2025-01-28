import { RpcTarget, WorkerEntrypoint, WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { uspsZipLookupParser, type UspsZipLookupParser } from './zoddles/usps/uspsLookup';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { formSubmissions } from './db/schema';
import { and, eq } from 'drizzle-orm';
import { type FormSubmissionType } from './zoddles/form-submission/formSubmissionType';
import * as schema from "./db/schema";

/**
 * Main Worker class for handling HTTP requests
 */
export default class extends WorkerEntrypoint<Env> {
	async fetch() {
		return new Response('Hello from Worker B');
	}
}

/**
 * Database operations handler using Cloudflare D1
 */
class D1 extends RpcTarget {
	private readonly env: Env;
	private readonly db: DrizzleD1Database<typeof schema>;

	constructor(env: Env) {
		super();
		this.env = env;
		this.db = drizzle(env.DB, { schema });
	}


	/**
	 * Retrieves all form submissions from the database
	 * @returns Promise<Array<FormSubmission>>
	 */
	async listAllRecords(): Promise<schema.SelectFormSubmissions[]> {
		return this.db.select().from(formSubmissions);
	}

	/**
	 * Inserts a new form submission into the database
	 * Checks for existing submissions with the same email and phone
	 * @param submissionData - The form submission data
	 * @returns Promise<FormSubmission>
	 */
	async insertSubmission(submissionData: FormSubmissionType): Promise<schema.SelectFormSubmissions> {
		const timeNow = new Date(Date.now());

		console.log("submissionData", submissionData);

		// Check for existing submission with same email and phone
		// const checkExisting = await this.db.select()
		// 	.from(formSubmissions)
		// 	.where(
		// 		and(
		// 			eq(formSubmissions.email, submissionData.email),
		// 			eq(formSubmissions.phone, submissionData.phone)
		// 		)
		// 	)
		// 	.limit(1);

		// if (checkExisting.length > 0) {
		// 	throw new Error("Submission already exists");
		// }

		// Insert new submission
		const insertResult = await this.db.insert(formSubmissions)
			.values({
				...submissionData,
				createdAt: timeNow
			})
			.returning();

		console.log("insertResult", insertResult);	

		return insertResult[0];
	}
}

/**
 * Worker class that exposes D1 database methods
 */
export class D1Worker extends WorkerEntrypoint<Env> {
	async D1Methods() {
		return new D1(this.env);
	}
}

/**
 * Worker class that exposes ZIP code lookup methods
 */
export class Zips extends WorkerEntrypoint<Env> {
	async newZipMethods() {
		return new ZipMethods(this.env);
	}
}

/**
 * Formats the KV prefix for ZIP code lookups
 * @param kvPrefix - The prefix to use
 * @param zip - The ZIP code
 * @returns Formatted KV key
 */
const kvPrefixFormatter = (kvPrefix: string, zip: string): string => 
	`${kvPrefix}:${zip}`;

/**
 * Handles ZIP code lookup operations using USPS API and KV cache
 */
class ZipMethods extends RpcTarget {
	private readonly env: Env;

	constructor(env: Env) {
		super();
		this.env = env;
	}

	/**
	 * Retrieves all ZIP codes from KV storage
	 * @returns Promise<Array<UspsZipLookupParser>>
	 */
	async listAllZips(): Promise<UspsZipLookupParser[]> {
		const kvStash = this.env.contracting_estimates;
		const listAll = await kvStash.list({ prefix: "zip:" });

		return listAll.keys
			.map(x => {
				const parseMeta = uspsZipLookupParser.safeParse(x.metadata);
				return parseMeta.success ? parseMeta.data : false;
			})
			.filter((x): x is UspsZipLookupParser => !!x);
	}

	/**
	 * Looks up ZIP code information using USPS API with KV caching
	 * @param zip - The ZIP code to look up
	 * @returns Promise<UspsZipLookupParser>
	 * @throws Error if USPS API request fails or returns invalid data
	 */
	async uspsZipCheck(zip: string): Promise<UspsZipLookupParser> {
		const kvStash = this.env.contracting_estimates;
		const kvPrefix = kvPrefixFormatter("zip", zip);

		// Try to get from cache first
		const checkZip = await kvStash.getWithMetadata(kvPrefix);
		if (checkZip.metadata !== null) {
			const parsedMetadata = uspsZipLookupParser.safeParse(checkZip.metadata);
			console.log("parsedMetadata", parsedMetadata);
			if (parsedMetadata.success) {
				console.log("hit kv cache");
				return parsedMetadata.data;
			}
		}

		// If not in cache, fetch from USPS API
		const getZipResult = await fetch(
			"https://tools.usps.com/tools/app/ziplookup/cityByZip",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept": "application/json, text/javascript, */*; q=0.01",
				},
				body: new URLSearchParams({ zip }),
				redirect: "follow"
			}
		);

		if (!getZipResult.ok) {
			throw new Error("Failed to get zip from USPS");
		}

		const parsedResult = uspsZipLookupParser.safeParse(await getZipResult.json());
		if (!parsedResult.success) {
			throw new Error("Failed: parsing returned json from USPS");
		}

		// Cache the result
		const uspsJson = parsedResult.data;
		await kvStash.put(kvPrefix, JSON.stringify(uspsJson), { metadata: uspsJson });

		return uspsJson;
	}
}

