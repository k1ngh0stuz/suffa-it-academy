import { CourseCard } from "./course-card";
import type { Course } from "@/types";

interface CoursesSectionProps {
  courses: Course[];
}

export function CoursesSection({ courses }: CoursesSectionProps) {
  return (
    <section id="courses" className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-sm text-brand-cyan">
            Программы обучения
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-100">Наши курсы</h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Три направления подготовки — от сетевого инжиниринга до этичного хакинга. Курсы в
            разработке откроются без переустановки сайта.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
