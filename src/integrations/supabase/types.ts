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
      app_users: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          last_login: string | null
          phone: string | null
          position: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id: string
          last_login?: string | null
          phone?: string | null
          position?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          position?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_solutions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string
          industry: string
          name: string
          recommended: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          industry: string
          name: string
          recommended?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          industry?: string
          name?: string
          recommended?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          company_name: string
          company_size: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          creation_date: string | null
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          logo_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          creation_date?: string | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          creation_date?: string | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      home_sections: {
        Row: {
          button_text: string | null
          button_url: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          section_type: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          section_type: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          section_type?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          menu_location: string
          order_index: number | null
          parent_id: string | null
          required_role: string | null
          requires_auth: boolean | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_location: string
          order_index?: number | null
          parent_id?: string | null
          required_role?: string | null
          requires_auth?: boolean | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_location?: string
          order_index?: number | null
          parent_id?: string | null
          required_role?: string | null
          requires_auth?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_products: {
        Row: {
          created_at: string
          id: string
          offer_id: string
          product_id: string
          quantity: number
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          offer_id: string
          product_id: string
          quantity?: number
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          offer_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_products_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          contact_name: string | null
          created_at: string
          created_by: string
          customer_id: string
          customer_industry: string | null
          customer_name: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["offer_status"]
          total_amount: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          created_by: string
          customer_id: string
          customer_industry?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string
          customer_industry?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      product_documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_type: string | null
          file_url: string
          id: string
          order_index: number | null
          product_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          order_index?: number | null
          product_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          order_index?: number | null
          product_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          order_index: number | null
          product_id: string | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_features: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_highlighted: boolean | null
          name: string
          order_index: number | null
          product_id: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_highlighted?: boolean | null
          name: string
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_highlighted?: boolean | null
          name?: string
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          order_index: number | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_partners: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_partners_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tag_relations: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          tag_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          tag_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_tag_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "product_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_price: number | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          rating: number | null
          specs: Json | null
          status: Database["public"]["Enums"]["product_status"] | null
          subcategory: string | null
          tags: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          rating?: number | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          rating?: number | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string | null
          from_path: string
          id: string
          is_active: boolean | null
          status_code: number | null
          to_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_path: string
          id?: string
          is_active?: boolean | null
          status_code?: number | null
          to_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_path?: string
          id?: string
          is_active?: boolean | null
          status_code?: number | null
          to_path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reporting_data: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          id: string
          report_date: string
          subcategory: string | null
          unit: string | null
          value: number
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          report_date: string
          subcategory?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          report_date?: string
          subcategory?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          key: string
          language: string | null
          page: string
          section: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          key: string
          language?: string | null
          page: string
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          key?: string
          language?: string | null
          page?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_notifications: {
        Row: {
          content: string
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          link_text: string | null
          link_url: string | null
          start_date: string | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          start_date?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          start_date?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      solution_products: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          solution_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          solution_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          solution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_products_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "business_solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_image_url: string | null
          client_name: string
          client_position: string | null
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          client_company?: string | null
          client_image_url?: string | null
          client_name: string
          client_position?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          client_company?: string | null
          client_image_url?: string | null
          client_name?: string
          client_position?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          daily_digest: boolean | null
          email_notifications: boolean | null
          id: string
          new_comment: boolean | null
          offer_accepted: boolean | null
          offer_created: boolean | null
          offer_rejected: boolean | null
          updated_at: string | null
          user_id: string | null
          weekly_report: boolean | null
        }
        Insert: {
          created_at?: string | null
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          new_comment?: boolean | null
          offer_accepted?: boolean | null
          offer_created?: boolean | null
          offer_rejected?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_report?: boolean | null
        }
        Update: {
          created_at?: string | null
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          new_comment?: boolean | null
          offer_accepted?: boolean | null
          offer_created?: boolean | null
          offer_rejected?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_report?: boolean | null
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
      user_system_preferences: {
        Row: {
          auto_logout: number | null
          auto_save: boolean | null
          created_at: string | null
          dark_mode: boolean | null
          data_retention: number | null
          id: string
          language: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_logout?: number | null
          auto_save?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          data_retention?: number | null
          id?: string
          language?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_logout?: number | null
          auto_save?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          data_retention?: number | null
          id?: string
          language?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "superadmin"
      industry_type:
        | "business"
        | "hotel"
        | "health"
        | "education"
        | "public"
        | "other"
      offer_status:
        | "draft"
        | "sent"
        | "in_progress"
        | "accepted"
        | "rejected"
        | "expired"
      product_status: "active" | "inactive" | "coming_soon" | "discontinued"
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
    Enums: {
      app_role: ["user", "admin", "superadmin"],
      industry_type: [
        "business",
        "hotel",
        "health",
        "education",
        "public",
        "other",
      ],
      offer_status: [
        "draft",
        "sent",
        "in_progress",
        "accepted",
        "rejected",
        "expired",
      ],
      product_status: ["active", "inactive", "coming_soon", "discontinued"],
    },
  },
} as const
