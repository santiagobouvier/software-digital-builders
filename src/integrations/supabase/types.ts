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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bot_billing_events: {
        Row: {
          amount: number
          bot_id: string
          company_id: string
          created_at: string
          description: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["billing_event_type"]
          id: string
          subscription_id: string
        }
        Insert: {
          amount: number
          bot_id: string
          company_id: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["billing_event_type"]
          id?: string
          subscription_id: string
        }
        Update: {
          amount?: number
          bot_id?: string
          company_id?: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["billing_event_type"]
          id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_billing_events_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_billing_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_billing_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "bot_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_instances: {
        Row: {
          bot_type: Database["public"]["Enums"]["product_category"]
          client_id: string
          created_at: string
          id: string
          notes: string | null
          product_id: string
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          bot_type: Database["public"]["Enums"]["product_category"]
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          bot_type?: Database["public"]["Enums"]["product_category"]
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_instances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_instances_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_instances_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "client_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_subscriptions: {
        Row: {
          annual_price: number
          bot_id: string
          company_id: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          monthly_price: number
          next_billing_at: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          plan_id: string | null
          started_at: string
          updated_at: string
        }
        Insert: {
          annual_price?: number
          bot_id: string
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          monthly_price?: number
          next_billing_at: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_id?: string | null
          started_at?: string
          updated_at?: string
        }
        Update: {
          annual_price?: number
          bot_id?: string
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          monthly_price?: number
          next_billing_at?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_id?: string | null
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_subscriptions_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          company_id: string
          created_at: string
          id: string
          last_event_at: string | null
          name: string
          status: Database["public"]["Enums"]["bot_status"]
          token: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          last_event_at?: string | null
          name: string
          status?: Database["public"]["Enums"]["bot_status"]
          token?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          last_event_at?: string | null
          name?: string
          status?: Database["public"]["Enums"]["bot_status"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "bots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_subscriptions: {
        Row: {
          client_id: string
          created_at: string
          custom_monthly: number
          custom_notes: string | null
          custom_one_time: number
          end_date: string | null
          id: string
          is_active: boolean
          item_type: Database["public"]["Enums"]["subscription_item_type"]
          pack_id: string | null
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          product_id: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          custom_monthly?: number
          custom_notes?: string | null
          custom_one_time?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          item_type: Database["public"]["Enums"]["subscription_item_type"]
          pack_id?: string | null
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          product_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          custom_monthly?: number
          custom_notes?: string | null
          custom_one_time?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          item_type?: Database["public"]["Enums"]["subscription_item_type"]
          pack_id?: string | null
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          product_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_subscriptions_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          contact_name: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["company_role"]
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      events_daily: {
        Row: {
          bot_id: string
          company_id: string
          date: string
          error_count: number
          handoff_count: number
          id: string
          lead_count: number
          msg_in_count: number
          msg_out_count: number
          updated_at: string
        }
        Insert: {
          bot_id: string
          company_id: string
          date: string
          error_count?: number
          handoff_count?: number
          id?: string
          lead_count?: number
          msg_in_count?: number
          msg_out_count?: number
          updated_at?: string
        }
        Update: {
          bot_id?: string
          company_id?: string
          date?: string
          error_count?: number
          handoff_count?: number
          id?: string
          lead_count?: number
          msg_in_count?: number
          msg_out_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_daily_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_daily_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_items: {
        Row: {
          created_at: string
          id: string
          pack_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          pack_id: string
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          pack_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "pack_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          billing_type: Database["public"]["Enums"]["billing_type"]
          category: Database["public"]["Enums"]["product_category"] | null
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_monthly: number
          price_one_time: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          billing_type?: Database["public"]["Enums"]["billing_type"]
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_monthly?: number
          price_one_time?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          billing_type?: Database["public"]["Enums"]["billing_type"]
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number
          price_one_time?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          annual_price: number
          created_at: string
          currency: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean
          monthly_price: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          annual_price?: number
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          monthly_price?: number
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          annual_price?: number
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          monthly_price?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_bot_access: {
        Row: {
          bot_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bot_access_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      web_instances: {
        Row: {
          client_id: string
          created_at: string
          domain: string | null
          id: string
          notes: string | null
          product_id: string
          status: string
          subscription_id: string
          updated_at: string
          web_type: Database["public"]["Enums"]["product_category"]
        }
        Insert: {
          client_id: string
          created_at?: string
          domain?: string | null
          id?: string
          notes?: string | null
          product_id: string
          status?: string
          subscription_id: string
          updated_at?: string
          web_type: Database["public"]["Enums"]["product_category"]
        }
        Update: {
          client_id?: string
          created_at?: string
          domain?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          web_type?: Database["public"]["Enums"]["product_category"]
        }
        Relationships: [
          {
            foreignKeyName: "web_instances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "web_instances_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "web_instances_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "client_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_belongs_to_company: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      user_has_bot_access: {
        Args: { _bot_id: string; _user_id: string }
        Returns: boolean
      }
      user_is_company_owner: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "professional" | "client"
      billing_event_type: "charge" | "refund" | "adjustment"
      billing_type: "one_time" | "recurring"
      bot_status: "active" | "paused"
      client_status: "lead" | "active" | "paused" | "cancelled"
      company_role: "owner" | "viewer"
      discount_type: "none" | "percent" | "fixed"
      pricing_mode: "catalog" | "custom"
      product_category:
        | "bot_whatsapp"
        | "bot_interno"
        | "web_rapida"
        | "web_autogestionable"
        | "otro"
      subscription_item_type: "product" | "pack"
      subscription_plan: "monthly" | "annual"
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
      app_role: ["professional", "client"],
      billing_event_type: ["charge", "refund", "adjustment"],
      billing_type: ["one_time", "recurring"],
      bot_status: ["active", "paused"],
      client_status: ["lead", "active", "paused", "cancelled"],
      company_role: ["owner", "viewer"],
      discount_type: ["none", "percent", "fixed"],
      pricing_mode: ["catalog", "custom"],
      product_category: [
        "bot_whatsapp",
        "bot_interno",
        "web_rapida",
        "web_autogestionable",
        "otro",
      ],
      subscription_item_type: ["product", "pack"],
      subscription_plan: ["monthly", "annual"],
    },
  },
} as const
