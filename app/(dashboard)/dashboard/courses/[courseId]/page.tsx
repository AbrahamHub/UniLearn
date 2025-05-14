import getCourseById from "@/sanity/lib/courses/getCourseById";
import { redirect } from "next/navigation";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
    return redirect("/");
  }

  // Redirigir a la primera lección del primer módulo si está disponible
  if (course.modules?.[0]?.lessons?.[0]?._id) {
    return redirect(
      `/dashboard/courses/${courseId}/lessons/${course.modules[0].lessons[0]._id}`
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Bienvenido a {course.title}</h2>
        <p className="text-muted-foreground">
          Este curso no tiene contenido aún. Por favor, vuelve más tarde.
        </p>
      </div>
    </div>
  );
}
