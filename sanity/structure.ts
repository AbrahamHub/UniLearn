import { StructureBuilder } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Panel de Administración")
    .items([
      // Contenido del Curso
      S.listItem()
        .title("Contenido del Curso")
        .child(
          S.documentTypeList("course")
            .title("Cursos")
            .child((courseId) =>
              S.list()
                .title("Opciones del Curso")
                .items([
                  // Opción para editar contenido del curso
                  S.listItem()
                    .title("Editar Contenido del Curso")
                    .child(
                      S.document().schemaType("course").documentId(courseId)
                    ),
                  // Opción para ver inscripciones
                  S.listItem()
                    .title("Ver Estudiantes")
                    .child(
                      S.documentList()
                        .title("Inscripciones al Curso")
                        .filter(
                          '_type == "enrollment" && course._ref == $courseId'
                        )
                        .params({ courseId })
                    ),
                ])
            )
        ),

      S.divider(),

      // Usuarios
      S.listItem()
        .title("Gestión de Usuarios")
        .child(
          S.list()
            .title("Selecciona un tipo de usuario")
            .items([
              // Instructores con opciones
              S.listItem()
                .title("Instructores")
                .schemaType("instructor")
                .child(
                  S.documentTypeList("instructor")
                    .title("Instructores")
                    .child((instructorId) =>
                      S.list()
                        .title("Opciones del Instructor")
                        .items([
                          // Opción para editar detalles del instructor
                          S.listItem()
                            .title("Editar Detalles del Instructor")
                            .child(
                              S.document()
                                .schemaType("instructor")
                                .documentId(instructorId)
                            ),
                          // Opción para ver cursos del instructor
                          S.listItem()
                            .title("Ver Cursos")
                            .child(
                              S.documentList()
                                .title("Cursos del Instructor")
                                .filter(
                                  '_type == "course" && instructor._ref == $instructorId'
                                )
                                .params({ instructorId })
                            ),
                        ])
                    )
                ),
              // Estudiantes con opciones
              S.listItem()
                .title("Estudiantes")
                .schemaType("student")
                .child(
                  S.documentTypeList("student")
                    .title("Estudiantes")
                    .child((studentId) =>
                      S.list()
                        .title("Opciones del Estudiante")
                        .items([
                          // Opción para editar detalles del estudiante
                          S.listItem()
                            .title("Editar Detalles del Estudiante")
                            .child(
                              S.document()
                                .schemaType("student")
                                .documentId(studentId)
                            ),
                          // Opción para ver inscripciones
                          S.listItem()
                            .title("Ver Inscripciones")
                            .child(
                              S.documentList()
                                .title("Inscripciones del Estudiante")
                                .filter(
                                  '_type == "enrollment" && student._ref == $studentId'
                                )
                                .params({ studentId })
                            ),
                          // Opción para ver lecciones completadas
                          S.listItem()
                            .title("Ver Lecciones Completadas")
                            .child(
                              S.documentList()
                                .title("Lecciones Completadas")
                                .schemaType("lessonCompletion")
                                .filter(
                                  '_type == "lessonCompletion" && student._ref == $studentId'
                                )
                                .params({ studentId })
                                .defaultOrdering([
                                  { field: "completedAt", direction: "desc" },
                                ])
                            ),
                        ])
                    )
                ),
            ])
        ),

      S.divider(),

      // Gestión del Sistema
      S.listItem()
        .title("Gestión del Sistema")
        .child(
          S.list()
            .title("Gestión del Sistema")
            .items([S.documentTypeListItem("category").title("Categorías")])
        ),
    ]);
