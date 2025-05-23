import { defineField, defineType } from "sanity";

export const moduleType = defineType({
  name: "module",
  title: "Módulo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título del Módulo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lessons",
      title: "Lecciones",
      type: "array",
      of: [{ type: "reference", to: { type: "lesson" } }],
    }),
  ],
});
