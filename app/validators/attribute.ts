import vine from "@vinejs/vine";

import string from "@adonisjs/core/helpers/string";

export const createAttributeSchema = vine.object({
  name: vine.string(),
  slug: vine
    .string()
    .unique(
      async (db, value, field) =>
        (await db
          .from("attributes")
          .where("slug", string.slug(value, { lower: true }))
          .andWhere("event_id", +field.meta.eventId)
          .first()) === null,
    )
    .transform((value) => string.slug(value, { lower: true }))
    .nullable()
    .optional(),
  type: vine.enum([
    "text",
    "textarea",
    "number",
    "file",
    "select",
    "block",
    "date",
    "time",
    "datetime",
    "multiselect",
    "email",
    "tel",
    "color",
    "checkbox",
  ]),
  options: vine.array(vine.string()).minLength(1).nullable().optional(),
  showInList: vine.boolean().optional(),
  isSensitiveData: vine.boolean().optional(),
  reason: vine.string().optional().requiredWhen("isSensitiveData", "=", true),
});

export const createAttributeValidator = vine.compile(createAttributeSchema);

export const UpdateAttributeSchema = vine.object({
  name: vine.string().optional(),
  slug: vine
    .string()
    .unique(
      async (db, value, field) =>
        (await db
          .from("attributes")
          .where("slug", string.slug(value, { lower: true }))
          .andWhere("event_id", +field.meta.eventId)
          .andWhereNot("id", +field.meta.attributeId)
          .first()) === null,
    )
    .transform((value) => string.slug(value, { lower: true }))
    .nullable()
    .optional(),
  type: vine
    .enum([
      "text",
      "textarea",
      "number",
      "file",
      "select",
      "multiselect",
      "block",
      "date",
      "time",
      "datetime",
      "email",
      "tel",
      "color",
      "checkbox",
    ])
    .optional(),
  options: vine.array(vine.string()).minLength(1).nullable().optional(),
  showInList: vine.boolean().optional(),
  isSensitiveData: vine.boolean().optional(),
  reason: vine.string().optional().requiredWhen("isSensitiveData", "=", true),
});

export const updateAttributeValidator = vine.compile(UpdateAttributeSchema);
