import { RpcTarget, WorkerEntrypoint } from 'cloudflare:workers';
import { uspsZipLookupParser, UspsZipLookupParser } from './zoddles/usps/uspsLookup';

export default class extends WorkerEntrypoint<Env> {
	async fetch() {
		return new Response('Hello from Worker B');
	}

	async parse() {
		return "test"
	}

	async fuckThisShit(testString: string) {

		return testString.split("").map(x => x + "xx").join("")
	}
}


export class Zips extends WorkerEntrypoint<Env> {

	async newZipMethods() {
		return new ZipMethods(this.env)
	}

}

const kvPrefixFormatter = (zip: string) => `zip:${zip}`

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

		const kvPrefix = kvPrefixFormatter(zip)

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

