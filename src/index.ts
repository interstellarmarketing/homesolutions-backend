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

export default class extends WorkerEntrypoint<Env> {
	async fetch() {
		return new Response('Hello from Worker B');
	}

	async parse() {
		return "test"
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
