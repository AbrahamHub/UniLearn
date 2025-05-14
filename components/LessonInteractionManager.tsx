"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Eye, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

interface LessonStats {
  views: number;
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
  comments: Comment[];
}

interface LessonInteractionManagerProps {
  courseId: string;
  lessonId: string;
  userId: string;
}

export default function LessonInteractionManager({
  courseId,
  lessonId,
  userId
}: LessonInteractionManagerProps) {
  const [stats, setStats] = useState<LessonStats>({
    views: 0,
    likes: 0,
    dislikes: 0,
    userReaction: null,
    comments: []
  });
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para obtener el nombre de usuario de Sanity o mostrar fallback
  async function getUserName(userId: string): Promise<string> {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const query = encodeURIComponent(`*[_type == "user" && _id == "${userId}"]{name}[0]`);
    const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.result?.name) {
        return json.result.name;
      }
    } catch (error) {
      console.error("Error fetching user name from Sanity:", error);
    }
    return "Alumno"; // fallback en lugar de mostrar el userID
  }

  // Fetch inicial y registrar vista
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primero obtenemos las estadísticas actuales
        const response = await fetch(
          `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`
        );
        const data = await response.json();
        setStats(data);
        
        // Luego registramos la vista
        await fetch(
          `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "view" })
          }
        );
        
        // Obtenemos las estadísticas actualizadas después de registrar la vista
        const updatedResponse = await fetch(
          `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`
        );
        const updatedData = await updatedResponse.json();
        // Agregar el nombre de usuario a cada comentario usando getUserName
        if (updatedData.comments && updatedData.comments.length > 0) {
          updatedData.comments = await Promise.all(
            updatedData.comments.map(async (comment: Comment) => ({
              ...comment,
              userName: await getUserName(comment.userId)
            }))
          );
        }
        setStats(updatedData);
      } catch (error) {
        console.error("Error fetching lesson stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [courseId, lessonId, userId]);

  const handleReaction = async (action: "like" | "dislike") => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action })
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error updating reaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "comment", text: commentText.trim() })
        }
      );
      const data = await response.json();
      setStats(data);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 border border-muted rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Interacción con la Lección</h2>
      
      {/* Estadísticas */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{stats.views} vistas</span>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{stats.likes} likes</span>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsDown className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{stats.dislikes} dislikes</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{stats.comments?.length || 0} comentarios</span>
        </div>
      </div>
      
      {/* Botones de like/dislike */}
      <div className="flex gap-4">
        <button
          onClick={() => handleReaction("like")}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            stats.userReaction === "like"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Me gusta</span>
        </button>
        <button
          onClick={() => handleReaction("dislike")}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            stats.userReaction === "dislike"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>No me gusta</span>
        </button>
      </div>
      
      {/* Formulario de comentarios */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Comentarios</h3>
        <div className="flex flex-col gap-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none min-h-[100px]"
          />
          <div className="flex justify-end">
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || isSubmitting}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>Comentar</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Lista de comentarios */}
        <div className="space-y-4 mt-6">
          {stats.comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </p>
          ) : (
            stats.comments
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {comment.userName || comment.userId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: es
                      })}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{comment.text}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}