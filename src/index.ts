import { RpcTarget, WorkerEntrypoint, WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { uspsZipLookupParser, UspsZipLookupParser } from './zoddles/usps/uspsLookup';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { submissions, users } from './db/schema';
import { and, eq } from 'drizzle-orm';
import { EstimateStoreType } from './zoddles/user/userEstimateType';
import * as schema from "./db/schema";

export default class extends WorkerEntrypoint<Env> {
	async fetch() {
		return new Response('Hello from Worker B');
	}

}

//export class TestWorfklow extends WorkflowEntrypoint<Env> {
//
//	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
//
//		const step1 = await step.do("step 1", async () => {
//			return {
//				inputParams: event,
//				files: [
//					'doc_7392_rev3.pdf',
//					'report_x29_final.pdf',
//					'memo_2024_05_12.pdf',
//					'file_089_update.pdf',
//					'proj_alpha_v2.pdf',
//					'data_analysis_q2.pdf',
//					'notes_meeting_52.pdf',
//					'summary_fy24_draft.pdf',
//				],
//			};
//		})
//
//
//	}
//}

class D1 extends RpcTarget {

	env: Env;
	db: DrizzleD1Database<typeof schema>

	constructor(env: Env) {
		super();
		this.env = env;
		this.db = drizzle(env.DB, { schema })
	}


	async listAllRecords(): Promise<schema.SelectUsersWithSubmissions[]> {
		const getAll = this.db.query.users.findMany({
			with: {
				subs: true
			}
		})

		return getAll
	}

	async insertSubmission(userInfo: EstimateStoreType, subSource: schema.SelectSubmissions["source"]): Promise<schema.SelectUsersWithSubmissions> {

		const checkExisting = await this.db.select().from(users).where(and(eq(users.email, userInfo.email), (eq(users.phone, userInfo.phone)))).limit(1)

		const timeNow = new Date(Date.now())

		let returnObject: schema.SelectUsersWithSubmissions

		if (!checkExisting.length) {

			const submitNewUser = await this.db.insert(users).values({
				...userInfo,
				createdAt: timeNow
			}).returning()

			const insertSubmission = await this.db.insert(submissions).values({
				userId: submitNewUser[0].id,
				shortTrade: userInfo.estimateShortTrade,
				action: userInfo.estimateAction,
				additionalType: userInfo.estimateType,
				source: subSource,
				createdAt: timeNow
			}).returning()

			returnObject = {
				...submitNewUser[0],
				subs: insertSubmission
			}
		} else {
			const userId = checkExisting[0]?.id

			const insertSubmission = await this.db.insert(submissions).values({
				userId: userId,
				shortTrade: userInfo.estimateShortTrade,
				action: userInfo.estimateAction,
				additionalType: userInfo.estimateType,
				source: subSource,
				createdAt: timeNow
			}).returning()

			returnObject = {
				...checkExisting[0],
				subs: insertSubmission
			}
		}

		return returnObject
	}
}

export class D1Worker extends WorkerEntrypoint<Env> {
	async D1Methods() {
		return new D1(this.env)
	}
}


export class Zips extends WorkerEntrypoint<Env> {
	async newZipMethods() {
		return new ZipMethods(this.env)
	}
}

const kvPrefixFormatter = (kvPrefix: string, zip: string) => `${kvPrefix}:${zip}`

class ZipMethods extends RpcTarget {

	private env: Env;

	constructor(env: Env) {
		super();
		this.env = env;
	}

	async listAllZips(): Promise<UspsZipLookupParser[]> {
		const kvStash = this.env.contracting_estimates

		const listAll = await kvStash.list({ prefix: "zip:" })

		const parsedMetadata = listAll.keys.map(x => {
			const parseMeta = uspsZipLookupParser.safeParse(x.metadata)
			if (parseMeta.success) {
				return parseMeta.data
			} else {
				return false
			}
		})

		return parsedMetadata.filter(x => !!x) as UspsZipLookupParser[]
	}

	async uspsZipCheck(zip: string): Promise<UspsZipLookupParser> {
		const kvStash = this.env.contracting_estimates

		const kvPrefix = kvPrefixFormatter("zip", zip)

		const checkZip = await kvStash.getWithMetadata(kvPrefix)

		if (checkZip.metadata !== null) {
			console.log("hit kv cache")
			const parsedMetadata = uspsZipLookupParser.safeParse(checkZip.metadata)

			if (parsedMetadata.success) {
				return parsedMetadata.data
			}
		}

		const getZipResult = await fetch("https://tools.usps.com/tools/app/ziplookup/cityByZip", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Sec-Fetch-Site": "same-origin",
				"Accept-Language": "en-US,en;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				"Sec-Fetch-Mode": "cors",
				"Host": "tools.usps.com",
				"Origin": "https://tools.usps.com",
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
				"Referer": "https://tools.usps.com/zip-code-lookup.htm?citybyzipcode",
				"Connection": "keep-alive",
				"Sec-Fetch-Dest": "empty",
				"X-Requested-With": "XMLHttpRequest",
			},
			body: new URLSearchParams({
				zip
			}),
			redirect: "follow"
		});

		if (!getZipResult.ok) {
			throw new Error("Failed to get zip from USPS");
		}

		const parsedResult = uspsZipLookupParser.safeParse(await getZipResult.json())

		if (!parsedResult.success) {
			throw new Error("Failed: parsing returned json from USPS");
		}

		const uspsJson = parsedResult.data

		await this.env.contracting_estimates.put(kvPrefix, JSON.stringify(uspsJson), { metadata: uspsJson })

		return uspsJson
	}
}

