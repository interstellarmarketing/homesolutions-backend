import { drizzle } from 'drizzle-orm/d1';
import { formSubmissionsOutbound, formSubmissions, type SelectFormSubmissions } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import axios from 'axios';

type SubmissionType = 'roofing' | 'solar';

const transformStringToSpaceAndCapitalizeFirstLetter = (str: string) => {
	return str.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

interface ApiConfig {
	url: string;
	headers: Record<string, string>;
	transformData: (submission: SelectFormSubmissions) => Record<string, any>;
}

interface ApiEndpoints {
	[key: string]: {
		url: string;
		headers: Record<string, string>;
		transformData: (submission: any) => Record<string, any> | string;
	};
}

const API_ENDPOINTS: ApiEndpoints = {
	solar: {
		url: 'https://highrollermarketing.leadlockerroom.com/api/leads',
		headers: {
			'Content-Type': 'application/json',
			authorization_token: 'JiUIX1ZB1RlJcKRBqGjN',
		},
		transformData: (submission) => ({
			affiliate_id: 'Mjc1',
			campaign_id: 'MjQwNQ==',
			authorization_token: 'JiUIX1ZB1RlJcKRBqGjN',
			posthog_person_id: submission.posthogPersonId,
			first_name: submission.firstName,
			last_name: submission.lastName,
			phone: submission.phone,
			email: submission.email,
			address: submission.streetAddress,
			zip_code: submission.zipCode,
			credit_score: submission.creditScore,
			trusted_form: submission.trustedFormCertUrl,
			own_rent: submission.isHomeowner ? 'Own' : 'Rent',
			hrM_gclid: submission.gclid,
			hrM_fbclid: submission.fbclid,
			hrM_utm_term: submission.utmTerm,
			hrM_utm_medium: submission.utmMedium,
			hrM_utm_source: submission.utmSource,
			hrM_utm_content: submission.utmContent,
			hrM_utm_campaign: submission.utmCampaign,
			hrM_ip_address: submission.ipAddress,
		}),
	},
	roofing: {
		url: 'https://solardirectmarketing.leadspediatrack.com/post.do',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		transformData: (submission) => {
			const params = new URLSearchParams({
				lp_campaign_id: '6732679a9df48',
				lp_campaign_key: 'VC4vnr9RNLp7t6MZbhJm',
				lp_response: 'JSON',
				lp_s1: '51R',
				tcpa_text:
					'By submitting my contact information including my telephone number above, I authorize Erie Home, to contact me via telephone calls and/or text messages (SMS), using automated dialing technology for marketing/advertising purposes. No purchase required. Message and data rates may apply.',
				first_name: submission.firstName,
				last_name: submission.lastName,
				email_address: submission.email,
				phone_home: submission.phone,
				address: submission.streetAddress,
				city: submission.city,
				state: submission.state,
				zip_code: submission.zipCode,
				ip_address: submission.ipAddress,
				repair_or_replace: transformStringToSpaceAndCapitalizeFirstLetter(submission.action),
				roof_type: transformStringToSpaceAndCapitalizeFirstLetter(submission.roofType),
				home_type: transformStringToSpaceAndCapitalizeFirstLetter(submission.homeType),
				trusted_form_cert_id: submission.trustedFormCertUrl,
				landing_page: submission.landingPage,
			});
			return params.toString();
		},
	},
	siding: {
		url: 'https://solardirectmarketing.leadspediatrack.com/post.do',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		transformData: (submission) => {
			const params = new URLSearchParams({
				lp_campaign_id: '67e590deb5206',
				lp_campaign_key: '9ZnkCfcHmzqVt4DJ3jFR',
				lp_response: 'JSON',
				lp_s1: '51Siding',
				tcpa_text:
					'By submitting my contact information including my telephone number above, I authorize chosen affiliates to contact me via telephone calls and/or text messages (SMS), using automated dialing technology for marketing/advertising purposes. No purchase required. Message and data rates may apply.',
				first_name: submission.firstName,
				last_name: submission.lastName,
				email_address: submission.email,
				phone_home: submission.phone,
				address: submission.streetAddress,
				city: submission.city,
				state: submission.state,
				zip_code: submission.zipCode,
				ip_address: submission.ipAddress,
				repair_or_replace: transformStringToSpaceAndCapitalizeFirstLetter(submission.action),
				siding_type: transformStringToSpaceAndCapitalizeFirstLetter(submission.roofType),
				home_type: transformStringToSpaceAndCapitalizeFirstLetter(submission.homeType),
				trusted_form_cert_id: submission.trustedFormCertUrl,
				landing_page: submission.landingPage,
			});
			return params.toString();
		},
	},
};

export class OutboundController {
	private env: Env;
	private db;

	constructor(env: Env) {
		this.env = env;
		this.db = drizzle(env.DB, { schema });
	}

	private isEnabled(): boolean {
		return true;
	}

	private async createOutboundEntry(formSubmissionId: number, apiUrl: string, requestBody: any, posthogPersonId: string | null) {
		return await this.db
			.insert(formSubmissionsOutbound)
			.values({
				formSubmissionId,
				posthogPersonId,
				apiUrl,
				requestBody,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning()
			.get();
	}

	private async updateOutboundEntry(
		id: number,
		data: {
			status: 'success' | 'failed';
			statusCode?: number;
			responseMessage?: string;
			responseBody?: string;
			errorMessage?: string;
		}
	) {
		return await this.db
			.update(formSubmissionsOutbound)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(formSubmissionsOutbound.id, id))
			.returning()
			.get();
	}

	async processSubmission(submissionId: number): Promise<any> {
		if (!this.isEnabled()) {
			console.log('Outbound processing is disabled. Skipping submission:', submissionId);
			return null;
		}

		try {
			const submission = await this.db.select().from(formSubmissions).where(eq(formSubmissions.id, submissionId)).get();

			if (!submission) {
				throw new Error(`Submission ${submissionId} not found`);
			}

			// Determine which API to use based on shortTrade
			const submissionType = (submission.shortTrade?.toLowerCase() || 'solar') as keyof typeof API_ENDPOINTS;
			const endpoint = API_ENDPOINTS[submissionType];

			const outbound = await this.createOutboundEntry(submissionId, endpoint.url, endpoint.transformData(submission), submission.posthogPersonId);
			console.log({ outbound });
			const response = await axios({
				method: 'POST',
				url: endpoint.url,
				headers: endpoint.headers,
				data: endpoint.transformData(submission),
			});

			const responseData = response.data;

			if (response.status >= 400) {
				console.log(
					await this.updateOutboundEntry(outbound.id, {
						status: 'failed',
						statusCode: response.status,
						responseMessage: response.statusText,
						responseBody: JSON.stringify(responseData),
						errorMessage: `API call failed with ${response.status}`,
					})
				);

				throw new Error(`API call failed with ${response.status}`);
			}

			if (responseData.result === 'failed') {
				console.log(
					await this.updateOutboundEntry(outbound.id, {
						status: 'failed',
						statusCode: response.status,
						responseMessage: responseData.msg,
						responseBody: JSON.stringify(responseData),
						errorMessage: responseData.errors?.[0]?.error || 'Unknown error',
					})
				);

				throw new Error(`API call failed with ${responseData.msg}`);
			}

			if (responseData.status === 'error') {
				await this.updateOutboundEntry(outbound.id, {
					status: 'failed',
					statusCode: response.status,
					responseMessage: responseData.message,
					responseBody: JSON.stringify(responseData),
					errorMessage: responseData.message,
				});

				throw new Error(`API call failed with: ${responseData.message}`);
			}

			await this.updateOutboundEntry(outbound.id, {
				status: 'success',
				statusCode: response.status,
				responseMessage: response.statusText,
				responseBody: JSON.stringify(responseData),
			});

			const updatedOutboundEntry = await this.db
				.select()
				.from(formSubmissionsOutbound)
				.where(eq(formSubmissionsOutbound.id, outbound.id))
				.get();

			console.log({ updatedOutboundEntry });

			return updatedOutboundEntry;
		} catch (error) {
			console.error('Error processing submission:', error);
			throw error;
		}
	}
}
