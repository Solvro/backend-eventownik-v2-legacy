import vine from "@vinejs/vine";

export const createBlockValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().nullable(),
    parentId: vine
      .number()
      .min(0)
      .exists({ table: "blocks", column: "id" })
      .nullable(),
    capacity: vine.number().min(1).nullable(),
  }),
);

export const updateBlockValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().nullable(),
    parentId: vine.number().min(0).nullable(),
    capacity: vine.number().min(1).nullable(),
  }),
);
