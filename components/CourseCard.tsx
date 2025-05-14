"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Loader } from "@/components/ui/loader";
import { CourseProgress } from "@/components/CourseProgress";
import {
  GetCoursesQueryResult,
  GetEnrolledCoursesQueryResult,
} from "@/sanity.types";

interface CourseCardProps {
  course:
    | GetCoursesQueryResult[number]
    | NonNullable<
        NonNullable<GetEnrolledCoursesQueryResult>["enrolledCourses"][number]["course"]
      >;
  progress?: number;
  href: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
  const [interactions, setInteractions] = useState({
    views: 0,
    likes: 0,
    dislikes: 0,
  });

  useEffect(() => {
    async function fetchInteractions() {
      try {
        // Se utiliza aggregate=1 para obtener la sumatoria de métricas por curso
        const res = await fetch(`/api/lesson-interactions?courseId=${course._id}&aggregate=1`);
        const data = await res.json();
        setInteractions({
          views: data.views || 0,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
        });
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    }
    if (course._id) {
      fetchInteractions();
    }
  }, [course._id]);

  return (
    <Link
      href={href}
      prefetch={false}
      className="group hover:no-underline flex"
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1">
        <div className="relative h-52 w-full overflow-hidden">
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ""}
              alt={course.title || "Imagen del Curso"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <Loader size="lg" />
            </div>
          )}
          {/* Nueva etiqueta para mostrar vistas, likes y dislikes provenientes de la API */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{interactions.views}</span>
            <span className="mx-1">|</span>
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{interactions.likes}</span>
            <span className="mx-1">|</span>
            <ThumbsDown className="w-4 h-4 mr-1" />
            <span>{interactions.dislikes}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
              {course.category?.name || "Sin Categoría"}
            </span>
            {"price" in course && typeof course.price === "number" && (
              <span className="text-white font-bold px-3 py-1 bg-black/50 dark:bg-white/20 rounded-full backdrop-blur-sm">
                {course.price === 0
                  ? "Gratis"
                  : `$${course.price.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}`}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>
          <div className="space-y-4 mt-auto">
            {course.instructor && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {course.instructor.photo ? (
                    <div className="relative h-8 w-8 mr-2">
                      <Image
                        src={urlFor(course.instructor.photo).url() || ""}
                        alt={course.instructor.name || "Instructor"}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 mr-2 rounded-full bg-muted flex items-center justify-center">
                      <Loader size="sm" />
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    por {course.instructor.name}
                  </span>
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {typeof progress === "number" && (
              <CourseProgress
                progress={progress}
                variant="default"
                size="sm"
                label="Progreso del Curso"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
