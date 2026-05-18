// Auto-generated types matching migration 0001.
// Run `npx supabase gen types typescript --local > src/lib/supabase/database.types.ts` to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "student" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          thumbnail: string | null;
          status: "available" | "coming_soon" | "archived";
          price_tiyin: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["modules"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["modules"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          course_id: string;
          title: string;
          description: string | null;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          duration_sec: number | null;
          sort_order: number;
          is_preview: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: "active" | "revoked" | "expired";
          granted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["enrollments"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          gateway: "uzumpay" | "payme" | "paynet" | "click";
          status: "pending" | "success" | "failed" | "cancelled" | "refunded";
          amount_tiyin: number;
          transaction_id: string;
          raw_payload: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["payments"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      manual_grants: {
        Row: {
          id: string;
          admin_id: string;
          student_id: string;
          course_id: string;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["manual_grants"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["manual_grants"]["Insert"]>;
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          watched_sec: number;
          completed: boolean;
          last_watched_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_progress"]["Row"],
          "id" | "last_watched_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["lesson_progress"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      has_enrollment: { Args: { p_course_id: string }; Returns: boolean };
    };
    Enums: {
      user_role: "student" | "admin";
      course_status: "available" | "coming_soon" | "archived";
      enrollment_status: "active" | "revoked" | "expired";
      payment_status: "pending" | "success" | "failed" | "cancelled" | "refunded";
      payment_gateway: "uzumpay" | "payme" | "paynet" | "click";
    };
    CompositeTypes: Record<string, never>;
  };
};
