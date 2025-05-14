import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { LoomEmbed } from "@/components/LoomEmbed";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import  LessonInteractionManager  from "@/components/LessonInteractionManager";

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  
  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);
  if (!lesson) return redirect(`/dashboard/courses/${courseId}`);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-muted-foreground mb-8">{lesson.description}</p>
          )}
          <div className="space-y-8">
            {/* Sección de Video y Loom */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}

            {/* Notas de la Lección */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notas de la Lección</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <PortableText value={lesson.content} />
                </div>
              </div>
            )}

            {/* Gestor de Interacciones */}
            <LessonInteractionManager 
              courseId={courseId}
              lessonId={lessonId}
              userId={user.id}
            />

            <div className="flex justify-end">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}