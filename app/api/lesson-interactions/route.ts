import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { currentUser } from "@clerk/nextjs/server";

const COLLECTION = "lessonStats";

// Helper para obtener parámetros de la URL
async function getParams(req: NextRequest) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  const lessonId = url.searchParams.get("lessonId");
  const userId = url.searchParams.get("userId");
  const aggregate = url.searchParams.get("aggregate"); // nuevo parámetro
  if (!courseId) {
    throw { status: 400, message: "El parámetro courseId es obligatorio" };
  }
  if (!lessonId && !aggregate) {
    throw { status: 400, message: "El parámetro lessonId es obligatorio si no se usa aggregate" };
  }
  return { courseId, lessonId, userId, aggregate };
}

// GET - Obtener estadísticas
export async function GET(req: NextRequest) {
  try {
    const { courseId, lessonId, userId, aggregate } = await getParams(req);
    
    // Conectar a MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTION);
    
    if (aggregate) {
      // Agregar estadísticas para todo el curso contando todas las lecciones
      const pipeline = [
        { $match: { courseId } },
        { 
          $group: {
            _id: "$courseId",
            views: { $sum: "$views" },
            likes: { 
              $sum: { 
                $size: { 
                  $filter: { input: "$reactions", cond: { $eq: ["$$this.type", "like"] } } 
                } 
              } 
            },
            dislikes: { 
              $sum: { 
                $size: { 
                  $filter: { input: "$reactions", cond: { $eq: ["$$this.type", "dislike"] } } 
                } 
              } 
            },
            commentsCount: {
              $sum: { $size: { $ifNull: ["$comments", []] } }
            }
          }
        },
        { $project: { _id: 0, courseId: "$_id", views: 1, likes: 1, dislikes: 1, commentsCount: 1 } }
      ];
      const aggResult = await collection.aggregate(pipeline).toArray();
      const result = aggResult[0] || { courseId, views: 0, likes: 0, dislikes: 0, commentsCount: 0 };
      return NextResponse.json(result);
    } else {
      // Buscar el documento usando courseId y lessonId
      const doc = await collection.findOne({ courseId, lessonId });
      const base = doc || { courseId, lessonId, reactions: [], views: 0, comments: [] };
      const likes = base.reactions?.filter((r: any) => r.type === "like").length || 0;
      const dislikes = base.reactions?.filter((r: any) => r.type === "dislike").length || 0;
      const userReaction = userId && base.reactions
        ? base.reactions.find((r: any) => r.userId === userId)?.type || null
        : null;
      const comments = (base.comments || []).map((c: any) => ({
        userId: c.userId,
        text: c.text,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      }));
      return NextResponse.json({
        courseId,
        lessonId,
        views: base.views || 0,
        likes,
        dislikes,
        userReaction,
        comments,
      });
    }
  } catch (error: any) {
    console.error("Error in GET /api/lesson-interactions:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" }, 
      { status: error.status || 500 }
    );
  }
}

// PATCH - Actualizar estadísticas de una lección
export async function PATCH(req: NextRequest) {
  try {
    // Verificar autenticación (opcional en desarrollo)
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }
    
    // Obtener parámetros y cuerpo de la petición
    const { courseId, lessonId, userId } = await getParams(req);
    const body = await req.json();
    const { action, text } = body;
    
    // Validar acción
    if (!action) {
      throw { status: 400, message: "El parámetro 'action' es obligatorio" };
    }
    
    // Validar userId
    const actualUserId = userId || user.id;
    if (!actualUserId) {
      throw { status: 400, message: "No se pudo determinar el ID del usuario" };
    }
    
    // Conectar a MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTION);
    
    // Asegurar que existe un documento para esta lección usando courseId y lessonId
    await collection.updateOne(
      { courseId, lessonId },
      { 
        $setOnInsert: { 
          courseId, 
          lessonId, 
          views: 0, 
          reactions: [], 
          comments: [] 
        } 
      },
      { upsert: true }
    );
    
    // Procesar la acción solicitada
    if (action === "view") {
      // Incrementar contador de vistas usando courseId y lessonId (solo se aumenta en +1)
      await collection.updateOne(
        { courseId, lessonId },
        { $inc: { views: (1/2) } }
      );
    } 
    else if (action === "like" || action === "dislike") {
      // Eliminar reacción previa del usuario
      await collection.updateOne(
        { courseId, lessonId },
        { $pull: { reactions: { userId: actualUserId } } }
      );
      
      // Verificar si el usuario ya había realizado esta misma acción
      const existingReaction = await collection.findOne({
        courseId,
        lessonId,
        "reactions": { 
          $elemMatch: { 
            userId: actualUserId, 
            type: action 
          } 
        }
      });
      
      // Si no existe la misma reacción, agregarla
      if (!existingReaction) {
        await collection.updateOne(
          { courseId, lessonId },
          { 
            $push: { 
              reactions: { 
                userId: actualUserId, 
                type: action,
                createdAt: new Date()
              } 
            } 
          }
        );
      }
    } 
    else if (action === "comment") {
      // Validar texto del comentario
      if (!text || typeof text !== 'string' || text.trim() === '') {
        throw { status: 400, message: "El texto del comentario es obligatorio" };
      }
      
      // Añadir comentario
      await collection.updateOne(
        { courseId, lessonId },
        { 
          $push: { 
            comments: { 
              userId: actualUserId, 
              text: text.trim(),
              createdAt: new Date() 
            } 
          } 
        }
      );
    } 
    else {
      throw { status: 400, message: `Acción '${action}' no válida` };
    }
    
    // Obtener documento actualizado usando courseId y lessonId
    const updated = await collection.findOne({ courseId, lessonId });
    if (!updated) {
      throw { status: 500, message: "Error al actualizar las estadísticas" };
    }
    
    // Calcular estadísticas actualizadas
    const reactions = updated.reactions || [];
    const likes = reactions.filter((r: any) => r.type === "like").length;
    const dislikes = reactions.filter((r: any) => r.type === "dislike").length;
    const userReaction = reactions.find((r: any) => r.userId === actualUserId)?.type || null;
    
    // Formatear comentarios
    const comments = (updated.comments || []).map((c: any) => ({
      userId: c.userId,
      text: c.text,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    }));
    
    // Devolver respuesta actualizada
    return NextResponse.json({
      courseId,
      lessonId,
      views: updated.views || 0,
      likes,
      dislikes,
      userReaction,
      comments,
    });
    
  } catch (error: any) {
    console.error("Error in PATCH /api/lesson-interactions:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" }, 
      { status: error.status || 500 }
    );
  }
}