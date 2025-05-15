export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      offers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          market_name: string
          status: string
          organization: string | null
          lot_number: string | null
          deadline: string | null
          commercial_manager_id: string | null
          technical_manager_id: string | null
          created_by_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          market_name: string
          status?: string
          organization?: string | null
          lot_number?: string | null
          deadline?: string | null
          commercial_manager_id?: string | null
          technical_manager_id?: string | null
          created_by_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          market_name?: string
          status?: string
          organization?: string | null
          lot_number?: string | null
          deadline?: string | null
          commercial_manager_id?: string | null
          technical_manager_id?: string | null
          created_by_id?: string
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          internal_code: string | null
          short_description: string | null
          long_description: string | null
          category_id: string | null
          technical_sheet_url: string | null
          pricing_info: Json | null
          delivery_time: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          internal_code?: string | null
          short_description?: string | null
          long_description?: string | null
          category_id?: string | null
          technical_sheet_url?: string | null
          pricing_info?: Json | null
          delivery_time?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          internal_code?: string | null
          short_description?: string | null
          long_description?: string | null
          category_id?: string | null
          technical_sheet_url?: string | null
          pricing_info?: Json | null
          delivery_time?: string | null
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role_id: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          preferences?: Json | null
        }
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
  }
} 