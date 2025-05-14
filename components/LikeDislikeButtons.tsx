"use client";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface LikeDislikeButtonsProps {
  courseId: string;
  lessonId: string;
  initialLikeCount?: number;
  initialDislikeCount?: number;
}

export default function LikeDislikeButtons({
  courseId,
  lessonId,
  initialLikeCount = 0,
  initialDislikeCount = 0,
}: LikeDislikeButtonsProps) {
  const [selection, setSelection] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [isLoading, setIsLoading] = useState(false);
  
  // Obtener el userId de la sesión del cliente
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Este es un enfoque simple para obtener el ID del usuario en el cliente
    // En una implementación real, podrías usar useClerk() o similar
    const getUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
          
          // Si tenemos el userId, obtener el estado actual de like/dislike
          if (data.id) {
            const statsResponse = await fetch(
              `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${data.id}`
            );
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              setSelection(statsData.userReaction);
              setLikeCount(statsData.likes);
              setDislikeCount(statsData.dislikes);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    
    getUserId();
  }, [courseId, lessonId]);

  const updateInteraction = async (action: "like" | "dislike") => {
    if (!userId) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(
        `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likes);
        setDislikeCount(data.dislikes);
        setSelection(data.userReaction);
      }
    } catch (error) {
      console.error("Error updating interaction", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    if (isLoading || !userId) return;
    updateInteraction("like");
  };

  const handleDislike = () => {
    if (isLoading || !userId) return;
    updateInteraction("dislike");
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
          selection === "like"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-muted hover:bg-muted/80"
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likeCount}</span>
      </button>
      
      <button
        onClick={handleDislike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
          selection === "dislike"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "bg-muted hover:bg-muted/80"
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
}