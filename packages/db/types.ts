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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          gstin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          gstin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          gstin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cottages: {
        Row: {
          id: string
          owner_id: string
          name: string
          address: string | null
          photos: string[] | null
          max_tenants: number | null
          gst_applicable: boolean | null
          rate_daily: number | null
          rate_weekly: number | null
          rate_monthly: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          address?: string | null
          photos?: string[] | null
          max_tenants?: number | null
          gst_applicable?: boolean | null
          rate_daily?: number | null
          rate_weekly?: number | null
          rate_monthly?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          address?: string | null
          photos?: string[] | null
          max_tenants?: number | null
          gst_applicable?: boolean | null
          rate_daily?: number | null
          rate_weekly?: number | null
          rate_monthly?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          owner_id: string
          cottage_id: string
          guest_name: string
          phone: string | null
          checkin_date: string
          checkout_date: string
          rate_type: 'daily' | 'weekly' | 'monthly'
          rate: number
          advance_paid: number | null
          status: 'booked' | 'checked_in' | 'checked_out' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          cottage_id: string
          guest_name: string
          phone?: string | null
          checkin_date: string
          checkout_date: string
          rate_type?: 'daily' | 'weekly' | 'monthly'
          rate: number
          advance_paid?: number | null
          status?: 'booked' | 'checked_in' | 'checked_out' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          cottage_id?: string
          guest_name?: string
          phone?: string | null
          checkin_date?: string
          checkout_date?: string
          rate_type?: 'daily' | 'weekly' | 'monthly'
          rate?: number
          advance_paid?: number | null
          status?: 'booked' | 'checked_in' | 'checked_out' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          owner_id: string
          cottage_id: string | null
          category: string
          amount: number
          expense_date: string
          receipt_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          cottage_id?: string | null
          category: string
          amount: number
          expense_date: string
          receipt_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          cottage_id?: string | null
          category?: string
          amount?: number
          expense_date?: string
          receipt_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      booking_status: 'booked' | 'checked_in' | 'checked_out' | 'cancelled'
      rate_type: 'daily' | 'weekly' | 'monthly'
    }
  }
}
