"use client";
import { useState } from "react";

interface Props {
  courseId: string;
  lessonId: string;
  userId: string;
  initialLikeCount?: number;
  initialDislikeCount?: number;
}

export default function LikeDislikeButtons({
  courseId,
  lessonId,
  userId,
  initialLikeCount = 0,
  initialDislikeCount = 0,
}: Props) {
  const [selection, setSelection] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);

  const updateApi = async (action: "like" | "dislike") => {
    try {
      const res = await fetch(
        `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setLikeCount(data.likes);
        setDislikeCount(data.dislikes);
      }
    } catch (error) {
      console.error("Error updating API", error);
    }
  };

  const handleLike = async () => {
    if (selection === "like") {
      // Implementar "undo" si la API lo admite, de lo contrario se puede dejar bloqueado
      setSelection(null);
      setLikeCount((prev) => prev - 1);
    } else {
      if (selection === "dislike") {
        setDislikeCount((prev) => prev - 1);
      }
      setSelection("like");
      await updateApi("like");
    }
  };

  const handleDislike = async () => {
    if (selection === "dislike") {
      setSelection(null);
      setDislikeCount((prev) => prev - 1);
    } else {
      if (selection === "like") {
        setLikeCount((prev) => prev - 1);
      }
      setSelection("dislike");
      await updateApi("dislike");
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={handleLike}
        disabled={selection === "dislike"}
        className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
          selection === "like" ? "ring-2 ring-blue-300" : ""
        }`}
      >
        <span role="img" aria-label="Like">👍</span> {likeCount}
      </button>
      <button
        onClick={handleDislike}
        disabled={selection === "like"}
        className={`bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
          selection === "dislike" ? "ring-2 ring-red-300" : ""
        }`}
      >
        <span role="img" aria-label="Dislike">👎</span> {dislikeCount}
      </button>
    </div>
  );
}
