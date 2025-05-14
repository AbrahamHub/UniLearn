import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const COLLECTION = "lessonStats";

async function getParams(req: NextRequest) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  const lessonId = url.searchParams.get("lessonId");
  const userId = url.searchParams.get("userId");
  if (!courseId || !lessonId) {
    throw { status: 400, message: "Faltan courseId o lessonId" };
  }
  return { courseId, lessonId, userId };
}

export async function GET(req: NextRequest) {
  try {
    const { courseId, lessonId, userId } = await getParams(req);
    const client = await clientPromise;
    const col = client.db().collection(COLLECTION);
    const doc = await col.findOne({ courseId, lessonId });
    const base = doc || { courseId, lessonId, reactions: [], views: 0, comments: [] };

    const likes = base.reactions.filter(r => r.type === "like").length;
    const dislikes = base.reactions.filter(r => r.type === "dislike").length;
    const userReaction = userId
      ? base.reactions.find(r => r.userId === userId)?.type || null
      : null;

    return NextResponse.json({
      courseId,
      lessonId,
      views: base.views,
      likes,
      dislikes,
      userReaction,
      comments: base.comments.map(c => ({
        userId: c.userId,
        text: c.text,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error interno" }, { status: e.status || 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { courseId, lessonId, userId } = await getParams(req);
    const { action, text } = await req.json();
    if (!action) throw { status: 400, message: "Falta acción" };

    const client = await clientPromise;
    const col = client.db().collection(COLLECTION);

    // Asegurar documento existente
    await col.updateOne(
      { courseId, lessonId },
      { $setOnInsert: { courseId, lessonId, views: 0, reactions: [], comments: [] } },
      { upsert: true }
    );

    if (action === "view") {
      await col.updateOne({ courseId, lessonId }, { $inc: { views: 1 } });
    } else if (action === "like" || action === "dislike") {
      if (!userId) throw { status: 400, message: "Falta userId para reacción" };
      // Remover reacción previa
      await col.updateOne({ courseId, lessonId }, { $pull: { reactions: { userId } } });
      // Agregar nueva si no existía
      const exists = await col.findOne({ courseId, lessonId, "reactions.userId": userId, "reactions.type": action });
      if (!exists) {
        await col.updateOne({ courseId, lessonId }, { $push: { reactions: { userId, type: action } } });
      }
    } else if (action === "comment") {
      if (!userId || !text) throw { status: 400, message: "Falta userId/text para comentario" };
      await col.updateOne(
        { courseId, lessonId },
        { $push: { comments: { userId, text, createdAt: new Date() } } }
      );
    } else {
      throw { status: 400, message: "Acción inválida" };
    }

    // Obtener documento actualizado
    const updated = await col.findOne({ courseId, lessonId });
    const reactions = updated!.reactions;
    const likes = reactions.filter(r => r.type === "like").length;
    const dislikes = reactions.filter(r => r.type === "dislike").length;
    const userReaction = userId
      ? reactions.find(r => r.userId === userId)?.type || null
      : null;

    return NextResponse.json({
      courseId,
      lessonId,
      views: updated!.views,
      likes,
      dislikes,
      userReaction,
      comments: updated!.comments.map(c => ({
        userId: c.userId,
        text: c.text,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error interno" }, { status: e.status || 500 });
  }
}
