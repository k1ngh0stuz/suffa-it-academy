export type UserRole = "student" | "admin";
export type CourseStatus = "available" | "coming_soon" | "archived";
export type EnrollmentStatus = "active" | "revoked" | "expired";
export type PaymentStatus = "pending" | "success" | "failed" | "cancelled" | "refunded";
export type PaymentGateway = "uzumpay" | "payme" | "paynet" | "click";

export interface Profile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  status: CourseStatus;
  price_tiyin: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface Lesson {
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
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  granted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  amount_tiyin: number;
  transaction_id: string;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ManualGrant {
  id: string;
  admin_id: string;
  student_id: string;
  course_id: string;
  note: string | null;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  watched_sec: number;
  completed: boolean;
  last_watched_at: string;
}

// ============================================================
// Composite view types
// ============================================================

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export interface PaymentWithCourse extends Payment {
  course: Pick<Course, "id" | "slug" | "title">;
  profile: Pick<Profile, "id" | "email" | "full_name">;
}

export interface ManualGrantWithDetails extends ManualGrant {
  course: Pick<Course, "id" | "slug" | "title">;
  admin: Pick<Profile, "id" | "email" | "full_name">;
  student: Pick<Profile, "id" | "email" | "full_name">;
}

// ============================================================
// Server Action response shape
// ============================================================
export type ActionResult<T = undefined> =
  | { error: string; success?: never; data?: never }
  | { success: string; error?: never; data?: T };

// ============================================================
// Payment gateway types
// ============================================================
export interface CreateOrderParams {
  userId: string;
  courseId: string;
  amountTiyin: number;
  returnUrl: string;
}

export interface CreateOrderResult {
  redirectUrl: string;
  transactionId: string;
}

export interface WebhookVerifyResult {
  verified: boolean;
  transactionId: string;
  status: PaymentStatus;
  amountTiyin?: number;
}
