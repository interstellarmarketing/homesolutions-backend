export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ad_platform_data: {
        Row: {
          ad_id: string | null
          ad_name: string | null
          ad_set_id: string | null
          ad_set_name: string | null
          campaign_id: string
          campaign_name: string | null
          clicks: number | null
          cpl: number | null
          created_at: string | null
          ctr: number | null
          date: string
          id: string
          impressions: number | null
          leads: number | null
          platform: string
          spend: number
          updated_at: string | null
        }
        Insert: {
          ad_id?: string | null
          ad_name?: string | null
          ad_set_id?: string | null
          ad_set_name?: string | null
          campaign_id: string
          campaign_name?: string | null
          clicks?: number | null
          cpl?: number | null
          created_at?: string | null
          ctr?: number | null
          date: string
          id?: string
          impressions?: number | null
          leads?: number | null
          platform: string
          spend?: number
          updated_at?: string | null
        }
        Update: {
          ad_id?: string | null
          ad_name?: string | null
          ad_set_id?: string | null
          ad_set_name?: string | null
          campaign_id?: string
          campaign_name?: string | null
          clicks?: number | null
          cpl?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number | null
          leads?: number | null
          platform?: string
          spend?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      alert_configurations: {
        Row: {
          alert_type: string
          created_at: string | null
          email_recipients: string[] | null
          id: string
          is_active: boolean | null
          sms_recipients: string[] | null
          threshold: number | null
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean | null
          sms_recipients?: string[] | null
          threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean | null
          sms_recipients?: string[] | null
          threshold?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      buyer_zip_codes: {
        Row: {
          buyer_id: string
          created_at: string | null
          effective_from: string
          effective_to: string | null
          id: string
          payout_amount: number
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          payout_amount: number
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          payout_amount?: number
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_zip_codes_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
      buyers: {
        Row: {
          api_endpoint: string | null
          api_key: string | null
          contact_person: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          integration_type: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key?: string | null
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key?: string | null
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_dispositions: {
        Row: {
          appointment_date: string | null
          buyer_id: string
          created_at: string | null
          id: string
          lead_id: string
          notes: string | null
          reason: string | null
          sale_amount: number | null
          sale_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_date?: string | null
          buyer_id: string
          created_at?: string | null
          id?: string
          lead_id: string
          notes?: string | null
          reason?: string | null
          sale_amount?: number | null
          sale_date?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string | null
          buyer_id?: string
          created_at?: string | null
          id?: string
          lead_id?: string
          notes?: string | null
          reason?: string | null
          sale_amount?: number | null
          sale_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_dispositions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_dispositions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          action: string | null
          buyer_id: string | null
          city: string | null
          created_at: string | null
          credit_score_eligible: boolean | null
          device_category: string | null
          email: string | null
          estimate_options: Json | null
          estimate_type: string | null
          fbc: string | null
          fbclid: string | null
          fbp: string | null
          first_name: string | null
          gbraid: string | null
          gclid: string | null
          id: string
          ip_address: string | null
          is_homeowner: boolean | null
          landing_page: string | null
          last_name: string | null
          outbound_api_request_body: Json | null
          outbound_api_request_url: string | null
          outbound_api_response_body: Json | null
          outbound_api_response_error_message: string | null
          outbound_api_response_message: string | null
          outbound_api_response_status: string | null
          outbound_api_response_status_code: number | null
          payout_amount: number | null
          phone: string | null
          posthog_person_id: string
          property_type: string | null
          source: string | null
          ssn: string | null
          state: string | null
          status: string | null
          street_address: string | null
          trusted_form_cert_url: string | null
          trusted_form_ping_url: string | null
          updated_at: string | null
          user_agent: string | null
          utility_bill_eligible: boolean | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wbraid: string | null
          zip_code: string | null
        }
        Insert: {
          action?: string | null
          buyer_id?: string | null
          city?: string | null
          created_at?: string | null
          credit_score_eligible?: boolean | null
          device_category?: string | null
          email?: string | null
          estimate_options?: Json | null
          estimate_type?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_name?: string | null
          gbraid?: string | null
          gclid?: string | null
          id?: string
          ip_address?: string | null
          is_homeowner?: boolean | null
          landing_page?: string | null
          last_name?: string | null
          outbound_api_request_body?: Json | null
          outbound_api_request_url?: string | null
          outbound_api_response_body?: Json | null
          outbound_api_response_error_message?: string | null
          outbound_api_response_message?: string | null
          outbound_api_response_status?: string | null
          outbound_api_response_status_code?: number | null
          payout_amount?: number | null
          phone?: string | null
          posthog_person_id: string
          property_type?: string | null
          source?: string | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          trusted_form_cert_url?: string | null
          trusted_form_ping_url?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utility_bill_eligible?: boolean | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wbraid?: string | null
          zip_code?: string | null
        }
        Update: {
          action?: string | null
          buyer_id?: string | null
          city?: string | null
          created_at?: string | null
          credit_score_eligible?: boolean | null
          device_category?: string | null
          email?: string | null
          estimate_options?: Json | null
          estimate_type?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_name?: string | null
          gbraid?: string | null
          gclid?: string | null
          id?: string
          ip_address?: string | null
          is_homeowner?: boolean | null
          landing_page?: string | null
          last_name?: string | null
          outbound_api_request_body?: Json | null
          outbound_api_request_url?: string | null
          outbound_api_response_body?: Json | null
          outbound_api_response_error_message?: string | null
          outbound_api_response_message?: string | null
          outbound_api_response_status?: string | null
          outbound_api_response_status_code?: number | null
          payout_amount?: number | null
          phone?: string | null
          posthog_person_id?: string
          property_type?: string | null
          source?: string | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          trusted_form_cert_url?: string | null
          trusted_form_ping_url?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utility_bill_eligible?: boolean | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wbraid?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_conversions: {
        Row: {
          conversion_date: string
          conversion_type: string
          created_at: string | null
          error_message: string | null
          id: string
          lead_id: string
          platform: string
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          conversion_date: string
          conversion_type: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id: string
          platform: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          conversion_date?: string
          conversion_type?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string
          platform?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_conversions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      zip_code_populations: {
        Row: {
          city: string | null
          created_at: string | null
          id: string
          population: number | null
          state: string | null
          zip_code: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          id?: string
          population?: number | null
          state?: string | null
          zip_code: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          id?: string
          population?: number | null
          state?: string | null
          zip_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

