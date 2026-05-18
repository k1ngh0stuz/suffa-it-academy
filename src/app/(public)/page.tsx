import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about";
import { CoursesSection } from "@/components/landing/courses-section";
import { WhyUsSection } from "@/components/landing/why-us";
import { LocationSection } from "@/components/landing/location";
import { getCourses } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Suffa IT Academy — IT курсы в Ферганской области",
};

export const revalidate = 60; // ISR: revalidate every minute

export default async function LandingPage() {
  const courses = await getCourses();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoursesSection courses={courses} />
      <WhyUsSection />
      <LocationSection />
    </>
  );
}
