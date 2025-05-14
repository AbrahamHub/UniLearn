"use client";
import { useState, useEffect } from "react";
import LikeDislikeButtons from "./LikeDislikeButtons";

interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

interface Stats {
  views: number;
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
  comments: Comment[];
}

export default function LessonStats({ courseId, lessonId, userId }: { courseId: string; lessonId: string; userId: string; }) {
  const [stats, setStats] = useState<Stats>({ views: 0, likes: 0, dislikes: 0, userReaction: null, comments: [] });
  const [commentText, setCommentText] = useState("");

  // Fetch inicial con userId en query
  useEffect(() => {
    fetch(
      `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`
    )
      .then(res => res.json())
      .then(data => setStats(data));
  }, [courseId, lessonId, userId]);

  // Incrementar vista sólo al montar
  useEffect(() => {
    fetch(
      `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "view" }) }
    );
  }, []);

  // Manejar like/dislike
  const handleReaction = (action: "like" | "dislike") => {
    fetch(
      `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }
    )
      .then(res => res.json())
      .then(data => setStats(data));
  };

  // Manejar comentario
  const handleComment = () => {
    if (!commentText.trim()) return;
    fetch(
      `/api/lesson-interactions?courseId=${courseId}&lessonId=${lessonId}&userId=${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", text: commentText.trim() }),
      }
    )
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setCommentText("");
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span>👁️ {stats.views}</span>
        <span>👍 {stats.likes}</span>
        <span>👎 {stats.dislikes}</span>
      </div>
      <LikeDislikeButtons
        selection={stats.userReaction}
        onLike={() => handleReaction("like")}
        onDislike={() => handleReaction("dislike")}
      />
      <div>
        <textarea
          className="w-full border rounded p-2"
          placeholder="Escribe un comentario..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button onClick={handleComment} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Comentar
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {(stats.comments || []).map((c, i) => (
          <div key={i} className="border-b py-2">
            <p className="font-semibold text-sm">{c.userId}</p>
            <p className="text-sm">{c.text}</p>
            <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
