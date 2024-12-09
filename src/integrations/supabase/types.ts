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
      family_calendar: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          event_name: string
          event_description: string | null
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          event_name: string
          event_description?: string | null
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          event_name?: string
          event_description?: string | null
          start_time?: string
          end_time?: string
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          message: string
          is_read: boolean
          event_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          message: string
          is_read?: boolean
          event_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          message?: string
          is_read?: boolean
          event_id?: string | null
        }
      }
      families: {
        Row: {
          id: string
          created_at: string
          family_name: string
        }
        Insert: {
          id?: string
          created_at?: string
          family_name: string
        }
        Update: {
          id?: string
          created_at?: string
          family_name?: string
        }
      }
      family_members: {
        Row: {
          id: string
          created_at: string
          family_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          family_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          family_id?: string
          user_id?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          created_at: string
          user_id: string
          browser_notifications: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          browser_notifications?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          browser_notifications?: boolean
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}