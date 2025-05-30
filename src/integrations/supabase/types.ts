export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability_calendar: {
        Row: {
          created_at: string
          date: string
          experience_instance_id: string | null
          id: string
          is_available: boolean
          minimum_stay: number | null
          notes: string | null
          property_id: string | null
          rate_override: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          experience_instance_id?: string | null
          id?: string
          is_available?: boolean
          minimum_stay?: number | null
          notes?: string | null
          property_id?: string | null
          rate_override?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          experience_instance_id?: string | null
          id?: string
          is_available?: boolean
          minimum_stay?: number | null
          notes?: string | null
          property_id?: string | null
          rate_override?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_calendar_experience_instance_id_fkey"
            columns: ["experience_instance_id"]
            isOneToOne: false
            referencedRelation: "experience_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_calendar_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_analytics: {
        Row: {
          booking_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          experience_booking_id: string | null
          experience_id: string | null
          id: string
          ip_address: unknown | null
          property_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          experience_booking_id?: string | null
          experience_id?: string | null
          id?: string
          ip_address?: unknown | null
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          experience_booking_id?: string | null
          experience_id?: string | null
          id?: string
          ip_address?: unknown | null
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      booking_guests: {
        Row: {
          booking_id: string
          created_at: string | null
          guest_age: number | null
          guest_name: string | null
          id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          guest_age?: number | null
          guest_name?: string | null
          id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          guest_age?: number | null
          guest_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          abandonment_reason: string | null
          amount_paid: number | null
          base_price_total: number
          booked_at: string
          booking_reference: string
          booking_status: string | null
          cancelled_at: string | null
          check_in_date: string
          check_out_date: string
          checked_in_at: string | null
          checked_out_at: string | null
          checkout_started_at: string | null
          cleaning_fee_total: number | null
          confirmed_at: string | null
          conversion_source: string | null
          created_at: string
          currency: string
          customer_notes: string | null
          discounts_total: number | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          internal_notes: string | null
          last_payment_attempt_at: string | null
          number_of_guests: number
          payment_attempt_count: number | null
          payment_id: string | null
          payment_status: string | null
          property_id: string
          source_booking_id: string | null
          source_platform: string | null
          special_requests: string | null
          taxes_total: number | null
          total_amount_due: number
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          abandonment_reason?: string | null
          amount_paid?: number | null
          base_price_total: number
          booked_at?: string
          booking_reference: string
          booking_status?: string | null
          cancelled_at?: string | null
          check_in_date: string
          check_out_date: string
          checked_in_at?: string | null
          checked_out_at?: string | null
          checkout_started_at?: string | null
          cleaning_fee_total?: number | null
          confirmed_at?: string | null
          conversion_source?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          discounts_total?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          internal_notes?: string | null
          last_payment_attempt_at?: string | null
          number_of_guests: number
          payment_attempt_count?: number | null
          payment_id?: string | null
          payment_status?: string | null
          property_id: string
          source_booking_id?: string | null
          source_platform?: string | null
          special_requests?: string | null
          taxes_total?: number | null
          total_amount_due: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          abandonment_reason?: string | null
          amount_paid?: number | null
          base_price_total?: number
          booked_at?: string
          booking_reference?: string
          booking_status?: string | null
          cancelled_at?: string | null
          check_in_date?: string
          check_out_date?: string
          checked_in_at?: string | null
          checked_out_at?: string | null
          checkout_started_at?: string | null
          cleaning_fee_total?: number | null
          confirmed_at?: string | null
          conversion_source?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          discounts_total?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          internal_notes?: string | null
          last_payment_attempt_at?: string | null
          number_of_guests?: number
          payment_attempt_count?: number | null
          payment_id?: string | null
          payment_status?: string | null
          property_id?: string
          source_booking_id?: string | null
          source_platform?: string | null
          special_requests?: string | null
          taxes_total?: number | null
          total_amount_due?: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_payment_id"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          applicable_to: string
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          experience_ids: string[] | null
          id: string
          is_active: boolean
          maximum_discount: number | null
          minimum_amount: number | null
          property_ids: string[] | null
          updated_at: string
          usage_limit: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          applicable_to?: string
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          experience_ids?: string[] | null
          id?: string
          is_active?: boolean
          maximum_discount?: number | null
          minimum_amount?: number | null
          property_ids?: string[] | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          applicable_to?: string
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          experience_ids?: string[] | null
          id?: string
          is_active?: boolean
          maximum_discount?: number | null
          minimum_amount?: number | null
          property_ids?: string[] | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      experience_bookings: {
        Row: {
          abandonment_reason: string | null
          amount_paid: number | null
          booked_at: string
          booking_reference: string
          booking_status: string | null
          cancelled_at: string | null
          checkout_started_at: string | null
          confirmed_at: string | null
          conversion_source: string | null
          created_at: string
          currency: string
          experience_instance_id: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          last_payment_attempt_at: string | null
          number_of_attendees: number
          payment_attempt_count: number | null
          payment_id: string | null
          payment_status: string | null
          source_booking_id: string | null
          source_platform: string | null
          special_requests: string | null
          total_amount_due: number
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          abandonment_reason?: string | null
          amount_paid?: number | null
          booked_at?: string
          booking_reference: string
          booking_status?: string | null
          cancelled_at?: string | null
          checkout_started_at?: string | null
          confirmed_at?: string | null
          conversion_source?: string | null
          created_at?: string
          currency?: string
          experience_instance_id: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_payment_attempt_at?: string | null
          number_of_attendees: number
          payment_attempt_count?: number | null
          payment_id?: string | null
          payment_status?: string | null
          source_booking_id?: string | null
          source_platform?: string | null
          special_requests?: string | null
          total_amount_due: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          abandonment_reason?: string | null
          amount_paid?: number | null
          booked_at?: string
          booking_reference?: string
          booking_status?: string | null
          cancelled_at?: string | null
          checkout_started_at?: string | null
          confirmed_at?: string | null
          conversion_source?: string | null
          created_at?: string
          currency?: string
          experience_instance_id?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_payment_attempt_at?: string | null
          number_of_attendees?: number
          payment_attempt_count?: number | null
          payment_id?: string | null
          payment_status?: string | null
          source_booking_id?: string | null
          source_platform?: string | null
          special_requests?: string | null
          total_amount_due?: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experience_bookings_experience_instance_id_fkey"
            columns: ["experience_instance_id"]
            isOneToOne: false
            referencedRelation: "experience_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experience_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_experience_bookings_payment_id"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_instances: {
        Row: {
          created_at: string
          current_attendees: number
          date: string
          experience_id: string
          flat_fee_price_override: number | null
          id: string
          location_details: string | null
          max_capacity: number
          price_per_person_override: number | null
          status: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_attendees?: number
          date: string
          experience_id: string
          flat_fee_price_override?: number | null
          id?: string
          location_details?: string | null
          max_capacity: number
          price_per_person_override?: number | null
          status?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_attendees?: number
          date?: string
          experience_id?: string
          flat_fee_price_override?: number | null
          id?: string
          location_details?: string | null
          max_capacity?: number
          price_per_person_override?: number | null
          status?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_instances_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          currency: string
          duration_minutes: number | null
          flat_fee_price: number | null
          id: string
          image_urls: string[] | null
          is_published: boolean | null
          location_type: string | null
          long_description: string | null
          max_capacity_per_instance: number
          name: string
          price_per_person: number | null
          short_description: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          duration_minutes?: number | null
          flat_fee_price?: number | null
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location_type?: string | null
          long_description?: string | null
          max_capacity_per_instance: number
          name: string
          price_per_person?: number | null
          short_description?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          duration_minutes?: number | null
          flat_fee_price?: number | null
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location_type?: string | null
          long_description?: string | null
          max_capacity_per_instance?: number
          name?: string
          price_per_person?: number | null
          short_description?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      external_rates: {
        Row: {
          created_at: string
          currency: string
          date: string
          fetched_at: string
          id: string
          is_available: boolean
          platform: string
          property_id: string
          rate_per_night: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          date: string
          fetched_at?: string
          id?: string
          is_available?: boolean
          platform: string
          property_id: string
          rate_per_night: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          date?: string
          fetched_at?: string
          id?: string
          is_available?: boolean
          platform?: string
          property_id?: string
          rate_per_night?: number
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          internal_notes: string | null
          message: string
          name: string
          package_id: string | null
          phone_number: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          internal_notes?: string | null
          message: string
          name: string
          package_id?: string | null
          phone_number?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          internal_notes?: string | null
          message?: string
          name?: string
          package_id?: string | null
          phone_number?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      package_items: {
        Row: {
          created_at: string | null
          details: string | null
          experience_id: string | null
          id: string
          item_type: string
          package_id: string
          property_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          experience_id?: string | null
          id?: string
          item_type: string
          package_id: string
          property_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          details?: string | null
          experience_id?: string | null
          id?: string
          item_type?: string
          package_id?: string
          property_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          base_price: number
          created_at: string
          currency: string
          description: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          name: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          base_price: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          abandoned_at: string | null
          amount: number
          attempt_number: number
          booking_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          experience_booking_id: string | null
          failure_code: string | null
          failure_description: string | null
          id: string
          ip_address: unknown | null
          payment_method: string | null
          razorpay_order_id: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          abandoned_at?: string | null
          amount: number
          attempt_number?: number
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          experience_booking_id?: string | null
          failure_code?: string | null
          failure_description?: string | null
          id?: string
          ip_address?: unknown | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          status: string
          user_agent?: string | null
        }
        Update: {
          abandoned_at?: string | null
          amount?: number
          attempt_number?: number
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          experience_booking_id?: string | null
          failure_code?: string | null
          failure_description?: string | null
          id?: string
          ip_address?: unknown | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          device_info: Json | null
          experience_booking_id: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          payment_gateway: string | null
          payment_link: string | null
          payment_method: string | null
          payment_status: string | null
          processed_at: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          retry_count: number | null
          transaction_id: string
          user_agent: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          device_info?: Json | null
          experience_booking_id?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          processed_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          retry_count?: number | null
          transaction_id: string
          user_agent?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          device_info?: Json | null
          experience_booking_id?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          processed_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          retry_count?: number | null
          transaction_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_experience_booking_id_fkey"
            columns: ["experience_booking_id"]
            isOneToOne: false
            referencedRelation: "experience_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_rates: {
        Row: {
          base_rate: number
          booking_url: string | null
          commission_rate: number
          created_at: string
          date: string
          experience_id: string | null
          external_listing_id: string | null
          fetched_at: string
          id: string
          is_available: boolean
          platform: string
          platform_fee: number
          property_id: string | null
          total_guest_pays: number
          updated_at: string
        }
        Insert: {
          base_rate: number
          booking_url?: string | null
          commission_rate?: number
          created_at?: string
          date: string
          experience_id?: string | null
          external_listing_id?: string | null
          fetched_at?: string
          id?: string
          is_available?: boolean
          platform: string
          platform_fee?: number
          property_id?: string | null
          total_guest_pays: number
          updated_at?: string
        }
        Update: {
          base_rate?: number
          booking_url?: string | null
          commission_rate?: number
          created_at?: string
          date?: string
          experience_id?: string | null
          external_listing_id?: string | null
          fetched_at?: string
          id?: string
          is_available?: boolean
          platform?: string
          platform_fee?: number
          property_id?: string | null
          total_guest_pays?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_rates_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_rates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          conditions: Json | null
          created_at: string
          discount_percentage: number | null
          experience_id: string | null
          id: string
          is_active: boolean
          markup_percentage: number | null
          priority: number
          property_id: string | null
          rule_name: string
          rule_type: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          discount_percentage?: number | null
          experience_id?: string | null
          id?: string
          is_active?: boolean
          markup_percentage?: number | null
          priority?: number
          property_id?: string | null
          rule_name: string
          rule_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          discount_percentage?: number | null
          experience_id?: string | null
          id?: string
          is_active?: boolean
          markup_percentage?: number | null
          priority?: number
          property_id?: string | null
          rule_name?: string
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_login_at: string | null
          phone_number: string | null
          registration_source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          last_login_at?: string | null
          phone_number?: string | null
          registration_source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login_at?: string | null
          phone_number?: string | null
          registration_source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          base_price_per_night: number
          cleaning_fee: number | null
          created_at: string
          currency: string
          id: string
          image_urls: string[] | null
          is_published: boolean | null
          location_details: string | null
          long_description: string | null
          max_guests: number
          name: string
          short_description: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          base_price_per_night: number
          cleaning_fee?: number | null
          created_at?: string
          currency?: string
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location_details?: string | null
          long_description?: string | null
          max_guests: number
          name: string
          short_description?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          base_price_per_night?: number
          cleaning_fee?: number | null
          created_at?: string
          currency?: string
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location_details?: string | null
          long_description?: string | null
          max_guests?: number
          name?: string
          short_description?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_calendar: {
        Row: {
          applied_discounts: Json | null
          base_rate: number
          competitor_rates: Json | null
          created_at: string
          date: string
          demand_score: number | null
          experience_instance_id: string | null
          final_rate: number
          gst_amount: number
          id: string
          property_id: string | null
          updated_at: string
        }
        Insert: {
          applied_discounts?: Json | null
          base_rate: number
          competitor_rates?: Json | null
          created_at?: string
          date: string
          demand_score?: number | null
          experience_instance_id?: string | null
          final_rate: number
          gst_amount: number
          id?: string
          property_id?: string | null
          updated_at?: string
        }
        Update: {
          applied_discounts?: Json | null
          base_rate?: number
          competitor_rates?: Json | null
          created_at?: string
          date?: string
          demand_score?: number | null
          experience_instance_id?: string | null
          final_rate?: number
          gst_amount?: number
          id?: string
          property_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved_at: string | null
          booking_id: string | null
          comment: string
          created_at: string
          experience_booking_id: string | null
          id: string
          is_approved: boolean
          rating: number
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          booking_id?: string | null
          comment: string
          created_at?: string
          experience_booking_id?: string | null
          id?: string
          is_approved?: boolean
          rating: number
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          booking_id?: string | null
          comment?: string
          created_at?: string
          experience_booking_id?: string | null
          id?: string
          is_approved?: boolean
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_experience_booking_id_fkey"
            columns: ["experience_booking_id"]
            isOneToOne: false
            referencedRelation: "experience_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
  public: {
    Enums: {},
  },
} as const
