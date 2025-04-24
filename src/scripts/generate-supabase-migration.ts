import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { formSubmissions, formSubmissionsOutbound, type SelectFormSubmissions, type SelectFormSubmissionsOutbound } from '../db/schema';
import { PublicLeadsInsertSchema } from '../models/supabase/zodTypes';

const execPromise = promisify(exec);

async function main() {
	try {
		// Create temp directory for storing query results if it doesn't exist
		const tempDir = './tmp';
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir);
		}

		// File paths for query results
		const submissionsFilePath = `${tempDir}/submissions.json`;
		const outboundSubmissionsFilePath = `${tempDir}/outbound_submissions.json`;

		// Run wrangler commands to export data from D1
		console.log('Fetching form submissions from D1...');
		await execPromise(`npx wrangler d1 execute estimates-zach-submissions --remote --command="SELECT * FROM form_submissions" --json > ${submissionsFilePath}`);

		console.log('Fetching form submissions outbound from D1...');
		await execPromise(`npx wrangler d1 execute estimates-zach-submissions --remote --command="SELECT * FROM form_submissions_outbound" --json > ${outboundSubmissionsFilePath}`);

		// Read and parse the exported JSON files
		const submissionsRaw = fs.readFileSync(submissionsFilePath, 'utf8');
		const outboundSubmissionsRaw = fs.readFileSync(outboundSubmissionsFilePath, 'utf8');

		// Parse the JSON data
		const submissions = (JSON.parse(submissionsRaw)[0].results as any[]).map(submission => {
			Object.keys(submission).forEach(key => {
				const val = submission[key as keyof SelectFormSubmissions];
				const newKey = Object.keys(formSubmissions).find(k => {
					const column = formSubmissions[k as keyof typeof formSubmissions];
					if (column && column.hasOwnProperty('name') && (column as any).name === key) {
						return true;
					}
					return false;
				});
				if (newKey) {
					submission[newKey] = val;
				}
			});
			return submission;
		});

		const outboundSubmissions = (JSON.parse(outboundSubmissionsRaw)[0].results as any[]).map(submission => {
			Object.keys(submission).forEach(key => {
				const val = submission[key as keyof SelectFormSubmissions];
				const newKey = Object.keys(formSubmissionsOutbound).find(k => {
					const column = formSubmissionsOutbound[k as keyof typeof formSubmissionsOutbound];
					if (column && column.hasOwnProperty('name') && (column as any).name === key) {
						return true;
					}
					return false;
				});
				if (newKey) {
					submission[newKey] = val;
				}
			});
			return submission;
		});

		console.log(`Retrieved ${submissions.length} form submissions`);
		console.log(`Retrieved ${outboundSubmissions.length} outbound submissions`);

		// Transform the data for Supabase
		const transformedData = transformForSupabase(
			submissions,
			outboundSubmissions
		);

		// Generate SQL seed file
		const seedSQL = generateSeedSQL(transformedData);

		// Write the SQL to a file
		const timestamp = new Date().toISOString().replace(/[:.]/g, '');
		const filename = `supabase-seed-${timestamp}.sql`;
		fs.writeFileSync(filename, seedSQL);

		console.log(`Seed file created: ${filename}`);

		// Clean up temp files
		// fs.unlinkSync(submissionsFilePath);
		// fs.unlinkSync(outboundSubmissionsFilePath);
	} catch (error) {
		console.error('Error connecting to database or generating seed data:', error);
		process.exit(1);
	}
}

/**
 * Transform function that takes data from D1 and prepares it for Supabase
 *
 * @param submissions - Array of form submissions from D1
 * @param outboundSubmissions - Array of outbound submissions from D1
 * @returns Transformed data ready for Supabase
 */
function transformForSupabase(submissions: SelectFormSubmissions[], outboundSubmissions: SelectFormSubmissionsOutbound[]): PublicLeadsInsertSchema[] {
	return submissions.map(submission => {
		const outboundSubmission = outboundSubmissions.find(os => os.formSubmissionId === submission.id);
		let estimateOptions = {};
		let payout_amount = 0;
		try {
			payout_amount = JSON.parse(outboundSubmission?.responseBody ?? '{}').price;
		} catch (error) {
			console.error('Error parsing payout:', error);
		}
		switch (submission.estimateType) {
			case 'roofing':
				estimateOptions = {
					roof_type: submission.roofType,
				};
				break;
			case 'solar':
				estimateOptions = {
					roof_type: submission.roofType,
					solar_reason: submission.solarReason,
					is_roof_shaded: submission.roofShade,
					solar_phone_submitted_at: submission.createdAt ? new Date(submission.createdAt).toISOString() : null,
				};
				break;
			case 'siding':
				estimateOptions = {
					siding_type: submission.roofType,
				};
				break;
		}
		return {
			action: submission.action,
			buyer_id: null,
			city: submission.city,
			created_at: submission.createdAt ? new Date(submission.createdAt).toISOString() : null,
			credit_score_eligible: (submission.creditScoreAboveOrEqual640 as any) === 1 || (submission.creditScoreAboveOrEqual640 as any) === '1' || (submission.creditScoreAboveOrEqual640 as any) === '1.0',
			device_category: submission.deviceCategory,
			email: submission.email,
			estimate_options: estimateOptions,
			estimate_type: submission.estimateType,
			fbc: submission.fbc,
			fbclid: submission.fbclid,
			fbp: submission.fbp,
			first_name: submission.firstName,
			gbraid: submission.gbraid,
			gclid: submission.gclid,
			ip_address: submission.ipAddress,
			is_homeowner: (submission.isHomeowner as any) === 1 || (submission.isHomeowner as any) === '1' || (submission.isHomeowner as any) === '1.0',
			landing_page: submission.landingPage === 'landing_page' ? null : submission.landingPage,
			last_name: submission.lastName,
			outbound_api_request_body: outboundSubmission?.requestBody,
			outbound_api_request_url: outboundSubmission?.apiUrl,
			outbound_api_response_body: outboundSubmission?.responseBody,
			outbound_api_response_error_message: outboundSubmission?.errorMessage,
			outbound_api_response_message: outboundSubmission?.responseMessage,
			outbound_api_response_status: outboundSubmission?.status,
			outbound_api_response_status_code: outboundSubmission?.statusCode,
			phone: submission.phone,
			posthog_person_id: submission.posthogPersonId ?? '',
			property_type: submission.homeType,
			ssn: submission.ssn,
			state: submission.state,
			status: 'submitted',
			submitted_at: submission.createdAt ? new Date(submission.createdAt).toISOString() : null,
			street_address: submission.streetAddress,
			trusted_form_cert_url: submission.trustedFormCertUrl,
			trusted_form_ping_url: submission.trustedFormPingUrl,
			updated_at: submission.createdAt ? new Date(submission.createdAt).toISOString() : null,
			user_agent: submission.userAgent,
			utility_bill_eligible: (submission.utilityBill as any) === 1 || (submission.utilityBill as any) === '1' || (submission.utilityBill as any) === '1.0',
			utm_campaign: submission.utmCampaign,
			utm_content: submission.utmContent,
			utm_medium: submission.utmMedium,
			utm_source: submission.utmSource,
			utm_term: submission.utmTerm,
			wbraid: submission.wbraid,
			zip_code: submission.zipCode,
			payout_amount,
		};
	});
}

/**
 * Generate SQL statements for Supabase seed data
 *
 * @param data - Transformed data
 * @returns SQL string for seeding the database
 */
function generateSeedSQL(data: PublicLeadsInsertSchema[]): string {
	let sql = '-- Supabase seed data generated on ' + new Date().toISOString() + '\n\n';

	if (data.length === 0) {
		sql += '-- No data to seed\n';
		return sql;
	}

	// Get all field names from the first record to build the column list
	const firstRecord = data[0];
	const columns = Object.keys(firstRecord);

	sql += `-- Inserting ${data.length} leads into the public.leads table\n`;
	sql += 'INSERT INTO public.leads\n';
	sql += `(${columns.join(', ')})\nVALUES\n`;

	// Generate values for each record
	const valueRows = data.map(record => {
		const values = columns.map(column => {
			const value = record[column as keyof typeof record];

			if (value === null || value === undefined || value === 'null') {
				return 'NULL';
			} else if (typeof value === 'string') {
				// Escape single quotes in strings
				return `'${value.replace(/'/g, "''")}'`;
			} else if (typeof value === 'number' || typeof value === 'boolean') {
				return String(value);
			} else if (typeof value === 'object') {
				// Handle JSON objects
				return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
			} else {
				return 'NULL';
			}
		});

		return `(${values.join(', ')})`;
	});

	// Join all values with commas
	sql += valueRows.join(',\n');
	sql += ';\n';

	return sql;
}

// Execute the main function
main().catch(console.error);
