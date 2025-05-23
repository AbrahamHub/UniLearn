import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
    }),
    defineField({
      name: "icon",
      title: "Ícono",
      type: "string",
      description: "Identificador de ícono (por ejemplo, para usar con librerías de íconos)",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Código de color para la categoría (por ejemplo, #FF0000)",
    }),
  ],
});
