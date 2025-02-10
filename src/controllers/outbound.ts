import { drizzle } from 'drizzle-orm/d1';
import { formSubmissionsOutbound, formSubmissions, SelectFormSubmissions } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';

type SubmissionType = 'roofing';

interface ApiConfig {
	url: string;
	headers: Record<string, string>;
	transformData: (submission: SelectFormSubmissions) => Record<string, any>;
}

interface ApiEndpoints {
	roofing: ApiConfig;
}

const API_ENDPOINTS: ApiEndpoints = {
	roofing: {
		url: 'https://highrollermarketing.leadlockerroom.com/api/leads',
		headers: {
			'Content-Type': 'application/json',
			authorization_token: 'JiUIX1ZB1RlJcKRBqGjN',
		},
		transformData: (submission) => ({
			affiliate_id: 'Mjc1',
			campaign_id: 'MjQwNQ==',
			authorization_token: 'JiUIX1ZB1RlJcKRBqGjN',
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

	private async createOutboundEntry(formSubmissionId: number, apiUrl: string) {
		return await this.db
			.insert(formSubmissionsOutbound)
			.values({
				formSubmissionId,
				apiUrl,
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

	async processSubmission(submissionId: number, type: SubmissionType) {
		if (!this.isEnabled()) {
			console.log('Outbound processing is disabled. Skipping submission:', submissionId);
			return null;
		}

		try {
			const apiConfig = API_ENDPOINTS[type];

			const outboundEntry = await this.createOutboundEntry(submissionId, apiConfig.url);

			const submission = await this.db.select().from(formSubmissions).where(eq(formSubmissions.id, submissionId)).get();

			if (!submission) {
				throw new Error('Submission not found');
			}

			const response = await fetch(apiConfig.url, {
				method: 'POST',
				headers: apiConfig.headers,
				body: JSON.stringify(apiConfig.transformData(submission)),
			});

			const responseBody: any = await response.text();
			const responseBodyJson = JSON.parse(responseBody);

			if (!response.ok) {
				await this.updateOutboundEntry(outboundEntry.id, {
					status: 'failed',
					statusCode: response.status,
					responseMessage: response.statusText,
					responseBody,
					errorMessage: `API call failed with status ${response.status}`,
				});

				throw new Error(`API call failed with status ${response.status}`);
			}

			if (responseBodyJson.status === 'error') {
				await this.updateOutboundEntry(outboundEntry.id, {
					status: 'failed',
					statusCode: response.status,
					responseMessage: responseBodyJson.message,
					responseBody,
					errorMessage: responseBodyJson.message,
				});

				throw new Error(`API call failed with status ${response.status}`);
			}

			await this.updateOutboundEntry(outboundEntry.id, {
				status: 'success',
				statusCode: response.status,
				responseMessage: response.statusText,
				responseBody,
			});

			const updatedOutboundEntry = await this.db
				.select()
				.from(formSubmissionsOutbound)
				.where(eq(formSubmissionsOutbound.id, outboundEntry.id))
				.get();

			return outboundEntry;
		} catch (error) {
			console.error('Error processing submission:', error);
			throw error;
		}
	}
}
