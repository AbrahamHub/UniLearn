import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { LoomEmbed } from "@/components/LoomEmbed";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import LessonStats from "@/components/LessonStats";
import LikeDislikeButtons from "@/components/LikeDislikeButtons";

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await currentUser();
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

            {/* Sección de Like/Dislike y Views en una misma línea */}
            <div className="flex items-center">
              <LikeDislikeButtons
                courseId={courseId}
                lessonId={lessonId}
                initialLikeCount={lesson.likes || 0}
                initialDislikeCount={lesson.dislikes || 0}
              />
              <div className="ml-auto bg-blue-500 text-white py-1 px-3 rounded">
                <span role="img" aria-label="Views">👁️</span>{" "}
                {lesson.views || 0} Vistas
              </div>
            </div>

            {/* Notas de la Lección por encima de los comentarios */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notas de la Lección</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <PortableText value={lesson.content} />
                </div>
              </div>
            )}

            {/* Sección de Comentarios */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                placeholder="Escribe un comentario..."
              />
              <button className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
                Comentar
              </button>
              <p className="mt-2 text-xs text-gray-500">
                user_2wvbgjIDjFnpfBrv4yZpcNyEucj
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Hola - 12/5/2025, 18:27:06
              </p>
            </div>

            <div className="flex justify-end">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
