/*
 * ==========================================
 * |          GENERATED BY SUPAZOD          |
 * ==========================================
 */

import { z } from "zod";
import { type Json } from "./types";

export const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.record(z.union([jsonSchema, z.undefined()])),
      z.array(jsonSchema),
    ])
    .nullable(),
);

export const graphqlPublicGraphqlArgsSchemaSchema = z.object({
  operationName: z.string().optional(),
  query: z.string().optional(),
  variables: jsonSchema.optional(),
  extensions: jsonSchema.optional(),
});

export const graphqlPublicGraphqlReturnsSchemaSchema = jsonSchema;

export const publicAdPlatformDataRowSchemaSchema = z.object({
  ad_id: z.string().nullable(),
  ad_name: z.string().nullable(),
  ad_set_id: z.string().nullable(),
  ad_set_name: z.string().nullable(),
  campaign_id: z.string(),
  campaign_name: z.string().nullable(),
  clicks: z.number().nullable(),
  cpl: z.number().nullable(),
  created_at: z.string().nullable(),
  ctr: z.number().nullable(),
  date: z.string(),
  id: z.string(),
  impressions: z.number().nullable(),
  leads: z.number().nullable(),
  platform: z.string(),
  spend: z.number(),
  updated_at: z.string().nullable(),
});

export const publicAdPlatformDataInsertSchemaSchema = z.object({
  ad_id: z.string().optional().nullable(),
  ad_name: z.string().optional().nullable(),
  ad_set_id: z.string().optional().nullable(),
  ad_set_name: z.string().optional().nullable(),
  campaign_id: z.string(),
  campaign_name: z.string().optional().nullable(),
  clicks: z.number().optional().nullable(),
  cpl: z.number().optional().nullable(),
  created_at: z.string().optional().nullable(),
  ctr: z.number().optional().nullable(),
  date: z.string(),
  id: z.string().optional(),
  impressions: z.number().optional().nullable(),
  leads: z.number().optional().nullable(),
  platform: z.string(),
  spend: z.number().optional(),
  updated_at: z.string().optional().nullable(),
});

export const publicAdPlatformDataUpdateSchemaSchema = z.object({
  ad_id: z.string().optional().nullable(),
  ad_name: z.string().optional().nullable(),
  ad_set_id: z.string().optional().nullable(),
  ad_set_name: z.string().optional().nullable(),
  campaign_id: z.string().optional(),
  campaign_name: z.string().optional().nullable(),
  clicks: z.number().optional().nullable(),
  cpl: z.number().optional().nullable(),
  created_at: z.string().optional().nullable(),
  ctr: z.number().optional().nullable(),
  date: z.string().optional(),
  id: z.string().optional(),
  impressions: z.number().optional().nullable(),
  leads: z.number().optional().nullable(),
  platform: z.string().optional(),
  spend: z.number().optional(),
  updated_at: z.string().optional().nullable(),
});

export const publicAlertConfigurationsRowSchemaSchema = z.object({
  alert_type: z.string(),
  created_at: z.string().nullable(),
  email_recipients: z.array(z.string()).nullable(),
  id: z.string(),
  is_active: z.boolean().nullable(),
  sms_recipients: z.array(z.string()).nullable(),
  threshold: z.number().nullable(),
  updated_at: z.string().nullable(),
});

export const publicAlertConfigurationsInsertSchemaSchema = z.object({
  alert_type: z.string(),
  created_at: z.string().optional().nullable(),
  email_recipients: z.array(z.string()).optional().nullable(),
  id: z.string().optional(),
  is_active: z.boolean().optional().nullable(),
  sms_recipients: z.array(z.string()).optional().nullable(),
  threshold: z.number().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicAlertConfigurationsUpdateSchemaSchema = z.object({
  alert_type: z.string().optional(),
  created_at: z.string().optional().nullable(),
  email_recipients: z.array(z.string()).optional().nullable(),
  id: z.string().optional(),
  is_active: z.boolean().optional().nullable(),
  sms_recipients: z.array(z.string()).optional().nullable(),
  threshold: z.number().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicBuyerZipCodesRowSchemaSchema = z.object({
  buyer_id: z.string(),
  created_at: z.string().nullable(),
  effective_from: z.string(),
  effective_to: z.string().nullable(),
  id: z.string(),
  payout_amount: z.number(),
  updated_at: z.string().nullable(),
  zip_code: z.string(),
});

export const publicBuyerZipCodesInsertSchemaSchema = z.object({
  buyer_id: z.string(),
  created_at: z.string().optional().nullable(),
  effective_from: z.string().optional(),
  effective_to: z.string().optional().nullable(),
  id: z.string().optional(),
  payout_amount: z.number(),
  updated_at: z.string().optional().nullable(),
  zip_code: z.string(),
});

export const publicBuyerZipCodesUpdateSchemaSchema = z.object({
  buyer_id: z.string().optional(),
  created_at: z.string().optional().nullable(),
  effective_from: z.string().optional(),
  effective_to: z.string().optional().nullable(),
  id: z.string().optional(),
  payout_amount: z.number().optional(),
  updated_at: z.string().optional().nullable(),
  zip_code: z.string().optional(),
});

export const publicBuyerZipCodesRelationshipsSchemaSchema = z.tuple([
  z.object({
    foreignKeyName: z.literal("buyer_zip_codes_buyer_id_fkey"),
    columns: z.tuple([z.literal("buyer_id")]),
    isOneToOne: z.literal(false),
    referencedRelation: z.literal("buyers"),
    referencedColumns: z.tuple([z.literal("id")]),
  }),
]);

export const publicBuyersRowSchemaSchema = z.object({
  api_endpoint: z.string().nullable(),
  api_key: z.string().nullable(),
  contact_person: z.string().nullable(),
  created_at: z.string().nullable(),
  description: z.string().nullable(),
  email: z.string().nullable(),
  id: z.string(),
  integration_type: z.string().nullable(),
  is_active: z.boolean().nullable(),
  name: z.string(),
  phone: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const publicBuyersInsertSchemaSchema = z.object({
  api_endpoint: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  id: z.string().optional(),
  integration_type: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  name: z.string(),
  phone: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicBuyersUpdateSchemaSchema = z.object({
  api_endpoint: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  id: z.string().optional(),
  integration_type: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  name: z.string().optional(),
  phone: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicLeadDispositionsRowSchemaSchema = z.object({
  appointment_date: z.string().nullable(),
  buyer_id: z.string(),
  created_at: z.string().nullable(),
  id: z.string(),
  lead_id: z.string(),
  notes: z.string().nullable(),
  reason: z.string().nullable(),
  sale_amount: z.number().nullable(),
  sale_date: z.string().nullable(),
  status: z.string(),
  updated_at: z.string().nullable(),
});

export const publicLeadDispositionsInsertSchemaSchema = z.object({
  appointment_date: z.string().optional().nullable(),
  buyer_id: z.string(),
  created_at: z.string().optional().nullable(),
  id: z.string().optional(),
  lead_id: z.string(),
  notes: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  sale_amount: z.number().optional().nullable(),
  sale_date: z.string().optional().nullable(),
  status: z.string(),
  updated_at: z.string().optional().nullable(),
});

export const publicLeadDispositionsUpdateSchemaSchema = z.object({
  appointment_date: z.string().optional().nullable(),
  buyer_id: z.string().optional(),
  created_at: z.string().optional().nullable(),
  id: z.string().optional(),
  lead_id: z.string().optional(),
  notes: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  sale_amount: z.number().optional().nullable(),
  sale_date: z.string().optional().nullable(),
  status: z.string().optional(),
  updated_at: z.string().optional().nullable(),
});

export const publicLeadDispositionsRelationshipsSchemaSchema = z.tuple([
  z.object({
    foreignKeyName: z.literal("lead_dispositions_buyer_id_fkey"),
    columns: z.tuple([z.literal("buyer_id")]),
    isOneToOne: z.literal(false),
    referencedRelation: z.literal("buyers"),
    referencedColumns: z.tuple([z.literal("id")]),
  }),
  z.object({
    foreignKeyName: z.literal("lead_dispositions_lead_id_fkey"),
    columns: z.tuple([z.literal("lead_id")]),
    isOneToOne: z.literal(false),
    referencedRelation: z.literal("leads"),
    referencedColumns: z.tuple([z.literal("id")]),
  }),
]);

export const publicLeadsRowSchemaSchema = z.object({
  action: z.string().nullable(),
  buyer_id: z.string().nullable(),
  city: z.string().nullable(),
  created_at: z.string().nullable(),
  credit_score_eligible: z.boolean().nullable(),
  device_category: z.string().nullable(),
  email: z.string().nullable(),
  estimate_options: jsonSchema.nullable(),
  estimate_type: z.string().nullable(),
  fbc: z.string().nullable(),
  fbclid: z.string().nullable(),
  fbp: z.string().nullable(),
  first_name: z.string().nullable(),
  gbraid: z.string().nullable(),
  gclid: z.string().nullable(),
  id: z.string(),
  ip_address: z.string().nullable(),
  is_homeowner: z.boolean().nullable(),
  landing_page: z.string().nullable(),
  last_name: z.string().nullable(),
  outbound_api_request_body: jsonSchema.nullable(),
  outbound_api_request_url: z.string().nullable(),
  outbound_api_response_body: jsonSchema.nullable(),
  outbound_api_response_error_message: z.string().nullable(),
  outbound_api_response_message: z.string().nullable(),
  outbound_api_response_status: z.string().nullable(),
  outbound_api_response_status_code: z.number().nullable(),
  payout_amount: z.number().nullable(),
  phone: z.string().nullable(),
  posthog_person_id: z.string(),
  property_type: z.string().nullable(),
  source: z.string().nullable(),
  ssn: z.string().nullable(),
  state: z.string().nullable(),
  status: z.string().nullable(),
  street_address: z.string().nullable(),
  trusted_form_cert_url: z.string().nullable(),
  trusted_form_ping_url: z.string().nullable(),
  updated_at: z.string().nullable(),
  user_agent: z.string().nullable(),
  utility_bill_eligible: z.boolean().nullable(),
  utm_campaign: z.string().nullable(),
  utm_content: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_source: z.string().nullable(),
  utm_term: z.string().nullable(),
  wbraid: z.string().nullable(),
  zip_code: z.string().nullable(),
});

export const publicLeadsInsertSchemaSchema = z.object({
  action: z.string().optional().nullable(),
  buyer_id: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  credit_score_eligible: z.boolean().optional().nullable(),
  device_category: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  estimate_options: jsonSchema.optional().nullable(),
  estimate_type: z.string().optional().nullable(),
  fbc: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  fbp: z.string().optional().nullable(),
  first_name: z.string().optional().nullable(),
  gbraid: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  id: z.string().optional(),
  ip_address: z.string().optional().nullable(),
  is_homeowner: z.boolean().optional().nullable(),
  landing_page: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  outbound_api_request_body: jsonSchema.optional().nullable(),
  outbound_api_request_url: z.string().optional().nullable(),
  outbound_api_response_body: jsonSchema.optional().nullable(),
  outbound_api_response_error_message: z.string().optional().nullable(),
  outbound_api_response_message: z.string().optional().nullable(),
  outbound_api_response_status: z.string().optional().nullable(),
  outbound_api_response_status_code: z.number().optional().nullable(),
  payout_amount: z.number().optional().nullable(),
  phone: z.string().optional().nullable(),
  posthog_person_id: z.string(),
  property_type: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  street_address: z.string().optional().nullable(),
  trusted_form_cert_url: z.string().optional().nullable(),
  trusted_form_ping_url: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  utility_bill_eligible: z.boolean().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_term: z.string().optional().nullable(),
  wbraid: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
});

export const publicLeadsUpdateSchemaSchema = z.object({
  action: z.string().optional().nullable(),
  buyer_id: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  credit_score_eligible: z.boolean().optional().nullable(),
  device_category: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  estimate_options: jsonSchema.optional().nullable(),
  estimate_type: z.string().optional().nullable(),
  fbc: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  fbp: z.string().optional().nullable(),
  first_name: z.string().optional().nullable(),
  gbraid: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  id: z.string().optional(),
  ip_address: z.string().optional().nullable(),
  is_homeowner: z.boolean().optional().nullable(),
  landing_page: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  outbound_api_request_body: jsonSchema.optional().nullable(),
  outbound_api_request_url: z.string().optional().nullable(),
  outbound_api_response_body: jsonSchema.optional().nullable(),
  outbound_api_response_error_message: z.string().optional().nullable(),
  outbound_api_response_message: z.string().optional().nullable(),
  outbound_api_response_status: z.string().optional().nullable(),
  outbound_api_response_status_code: z.number().optional().nullable(),
  payout_amount: z.number().optional().nullable(),
  phone: z.string().optional().nullable(),
  posthog_person_id: z.string().optional(),
  property_type: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  street_address: z.string().optional().nullable(),
  trusted_form_cert_url: z.string().optional().nullable(),
  trusted_form_ping_url: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  utility_bill_eligible: z.boolean().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_term: z.string().optional().nullable(),
  wbraid: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
});

export const publicLeadsRelationshipsSchemaSchema = z.tuple([
  z.object({
    foreignKeyName: z.literal("leads_buyer_id_fkey"),
    columns: z.tuple([z.literal("buyer_id")]),
    isOneToOne: z.literal(false),
    referencedRelation: z.literal("buyers"),
    referencedColumns: z.tuple([z.literal("id")]),
  }),
]);

export const publicOfflineConversionsRowSchemaSchema = z.object({
  conversion_date: z.string(),
  conversion_type: z.string(),
  created_at: z.string().nullable(),
  error_message: z.string().nullable(),
  id: z.string(),
  lead_id: z.string(),
  platform: z.string(),
  sent_at: z.string().nullable(),
  status: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const publicOfflineConversionsInsertSchemaSchema = z.object({
  conversion_date: z.string(),
  conversion_type: z.string(),
  created_at: z.string().optional().nullable(),
  error_message: z.string().optional().nullable(),
  id: z.string().optional(),
  lead_id: z.string(),
  platform: z.string(),
  sent_at: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicOfflineConversionsUpdateSchemaSchema = z.object({
  conversion_date: z.string().optional(),
  conversion_type: z.string().optional(),
  created_at: z.string().optional().nullable(),
  error_message: z.string().optional().nullable(),
  id: z.string().optional(),
  lead_id: z.string().optional(),
  platform: z.string().optional(),
  sent_at: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const publicOfflineConversionsRelationshipsSchemaSchema = z.tuple([
  z.object({
    foreignKeyName: z.literal("offline_conversions_lead_id_fkey"),
    columns: z.tuple([z.literal("lead_id")]),
    isOneToOne: z.literal(false),
    referencedRelation: z.literal("leads"),
    referencedColumns: z.tuple([z.literal("id")]),
  }),
]);

export const publicZipCodePopulationsRowSchemaSchema = z.object({
  city: z.string().nullable(),
  created_at: z.string().nullable(),
  id: z.string(),
  population: z.number().nullable(),
  state: z.string().nullable(),
  zip_code: z.string(),
});

export const publicZipCodePopulationsInsertSchemaSchema = z.object({
  city: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  id: z.string().optional(),
  population: z.number().optional().nullable(),
  state: z.string().optional().nullable(),
  zip_code: z.string(),
});

export const publicZipCodePopulationsUpdateSchemaSchema = z.object({
  city: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  id: z.string().optional(),
  population: z.number().optional().nullable(),
  state: z.string().optional().nullable(),
  zip_code: z.string().optional(),
});
