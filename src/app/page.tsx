// Root / is the landing page — served by (public)/page.tsx via route group
// This file re-exports to avoid a 404 at the root when the route group is present
export { default } from "@/app/(public)/page";
