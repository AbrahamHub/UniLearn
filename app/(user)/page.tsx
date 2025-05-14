import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { CourseCard } from '@/components/CourseCard';
import { getCourses } from '@/sanity/lib/courses/getCourses';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E2029] transition-colors duration-300">
      <Header />
      <Hero />

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-2xl font-bold text-green-600 dark:text-green-500">Cursos Destacados</span>
          {/* Cambiado a texto más grande y color verde */}
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
