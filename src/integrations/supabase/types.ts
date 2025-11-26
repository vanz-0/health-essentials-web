export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_events: {
        Row: {
          browser: string | null
          created_at: string
          device_type: string | null
          event_type: string
          id: number
          ip_address: string | null
          location: Json | null
          os: string | null
          provider: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: never
          ip_address?: string | null
          location?: Json | null
          os?: string | null
          provider?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: never
          ip_address?: string | null
          location?: Json | null
          os?: string | null
          provider?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      best_sellers_config: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          notes: string | null
          product_num: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          notes?: string | null
          product_num: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          notes?: string | null
          product_num?: string
          updated_at?: string
        }
        Relationships: []
      }
      Catalogue1: {
        Row: {
          "Attatchment Copy": string | null
          "Attatchment funfact": string | null
          "Attatchment Instructions": string | null
          Price: number | null
          "Product Name": string | null
          "Product Num": string | null
          "Product Type": string | null
          Size: string | null
          "Use case": string | null
        }
        Insert: {
          "Attatchment Copy"?: string | null
          "Attatchment funfact"?: string | null
          "Attatchment Instructions"?: string | null
          Price?: number | null
          "Product Name"?: string | null
          "Product Num"?: string | null
          "Product Type"?: string | null
          Size?: string | null
          "Use case"?: string | null
        }
        Update: {
          "Attatchment Copy"?: string | null
          "Attatchment funfact"?: string | null
          "Attatchment Instructions"?: string | null
          Price?: number | null
          "Product Name"?: string | null
          "Product Num"?: string | null
          "Product Type"?: string | null
          Size?: string | null
          "Use case"?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          consent_given: boolean | null
          created_at: string
          email: string
          full_name: string
          id: number
          last_contacted: string | null
          notes: string | null
          phone_number: string | null
          preferences: Json | null
          source: string | null
          subscribed: boolean | null
          subscription_date: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id?: never
          last_contacted?: string | null
          notes?: string | null
          phone_number?: string | null
          preferences?: Json | null
          source?: string | null
          subscribed?: boolean | null
          subscription_date?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: never
          last_contacted?: string | null
          notes?: string | null
          phone_number?: string | null
          preferences?: Json | null
          source?: string | null
          subscribed?: boolean | null
          subscription_date?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component_stack: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          metadata: Json | null
          page_url: string
          resolved: boolean | null
          resolved_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_stack?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          metadata?: Json | null
          page_url: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_stack?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean
          end_at: string | null
          id: number
          key: string
          payload: Json
          rollout: number
          start_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          end_at?: string | null
          id?: number
          key: string
          payload?: Json
          rollout?: number
          start_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          end_at?: string | null
          id?: number
          key?: string
          payload?: Json
          rollout?: number
          start_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: number
          last_restock_date: string | null
          location: string | null
          product_id: number
          quantity: number
          reorder_point: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          last_restock_date?: string | null
          location?: string | null
          product_id: number
          quantity?: number
          reorder_point?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          last_restock_date?: string | null
          location?: string | null
          product_id?: number
          quantity?: number
          reorder_point?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          points_balance: number
          total_earned: number
          total_redeemed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_balance?: number
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_balance?: number
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string
          customer_name: string | null
          id: string
          notes: string | null
          order_items: Json
          order_status: string
          payment_intent_id: string | null
          payment_status: string
          phone_number: string | null
          shipping_address: Json
          stripe_session_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          order_items: Json
          order_status?: string
          payment_intent_id?: string | null
          payment_status?: string
          phone_number?: string | null
          shipping_address: Json
          stripe_session_id?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          order_items?: Json
          order_status?: string
          payment_intent_id?: string | null
          payment_status?: string
          phone_number?: string | null
          shipping_address?: Json
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          connection_type: string | null
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          page_url: string
          user_agent: string | null
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          page_url: string
          user_agent?: string | null
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          page_url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          description: string | null
          featured: boolean
          id: number
          image_urls: string[] | null
          metadata: Json | null
          name: string
          price: number
          sku: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: never
          image_urls?: string[] | null
          metadata?: Json | null
          name: string
          price: number
          sku?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: never
          image_urls?: string[] | null
          metadata?: Json | null
          name?: string
          price?: number
          sku?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: number
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: never
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: never
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      shared_wishlists: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          share_token: string
          title: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          share_token: string
          title?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          share_token?: string
          title?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: number
          is_default: boolean
          label: string
          phone_number: string
          postal_code: string
          state_province: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: number
          is_default?: boolean
          label: string
          phone_number: string
          postal_code: string
          state_province: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: number
          is_default?: boolean
          label?: string
          phone_number?: string
          postal_code?: string
          state_province?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          email_verified: boolean | null
          failed_login_attempts: number | null
          id: number
          language: string | null
          last_password_change: string | null
          locked_until: string | null
          marketing_emails: boolean | null
          notification_preferences: Json | null
          phone_verified: boolean | null
          require_password_change: boolean | null
          theme: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_verified?: boolean | null
          failed_login_attempts?: number | null
          id?: never
          language?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          marketing_emails?: boolean | null
          notification_preferences?: Json | null
          phone_verified?: boolean | null
          require_password_change?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_verified?: boolean | null
          failed_login_attempts?: number | null
          id?: never
          language?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          marketing_emails?: boolean | null
          notification_preferences?: Json | null
          phone_verified?: boolean | null
          require_password_change?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_data: Json
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_data: Json
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_data?: Json
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extract_image_number: { Args: { url: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_auth_event: {
        Args: {
          p_event_type: string
          p_ip_address?: string
          p_provider?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: number
      }
      verify_admin_access: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
