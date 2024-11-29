/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

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

export class Testes extends WorkerEntrypoint<Env> {
	async yalla() {
		return "px"
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

}

export class Zips extends WorkerEntrypoint<Env> {

	async newZipMethods() {
		return new ZipMethods(this.env)
	}

}

export class ZipMethods extends RpcTarget {

	#env: Env

	constructor(env: Env) {
		super();
		this.#env = env;
	}


	async listAllZips(): Promise<UspsZipLookupParser[]> {
		const kvStash = this.#env.contracting_estimates

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
}

//export class OGWorker extends WorkerEntrypoint<Env> {
//	async og(f: string, inComponentAsString?: string) {
//		return new OGImage().image(f, inComponentAsString)
//	}
//}
//
//export class OGImage extends RpcTarget {
//	image(f: string, inComponentAsString?: string) {
//		return OG(f, inComponentAsString)
//	}
//}
