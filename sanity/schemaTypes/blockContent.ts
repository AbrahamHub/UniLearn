import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Contenido",
  type: "array",
  of: [{ type: "block" }],
});
