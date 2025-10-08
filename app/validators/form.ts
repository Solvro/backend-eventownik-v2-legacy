import vine from "@vinejs/vine";
import { DateTime } from "luxon";

function dateTimeTransform(value: Date): DateTime {
  const parsed = DateTime.fromISO(value.toISOString());
  if (!parsed.isValid) {
    throw new Error("Invalid date");
  }
  return parsed;
}

export const createFormValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string(),
    startDate: vine.date().transform(dateTimeTransform),
    attributes: vine
      .array(
        vine.object({
          uuid: vine.string(),
          isRequired: vine.boolean().optional(),
          isEditable: vine.boolean().optional(),
          order: vine.number().optional(),
        }),
      )
      .minLength(1),
    endDate: vine.date().transform(dateTimeTransform).optional(),
    isOpen: vine.boolean().optional(),
  }),
);

export const updateFormValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    startDate: vine.date().transform(dateTimeTransform).optional(),
    endDate: vine.date().transform(dateTimeTransform).optional(),
    attributes: vine
      .array(
        vine.object({
          uuid: vine.string(),
          isRequired: vine.boolean().optional(),
          isEditable: vine.boolean().optional(),
          order: vine.number().optional(),
        }),
      )
      .minLength(1)
      .optional(),
    isOpen: vine.boolean().optional(),
  }),
);

export const formSubmitValidator = vine.compile(
  vine
    .object({
      email: vine
        .string()
        .email()
        .unique(
          async (db, value, field) =>
            (await db
              .from("participants")
              .where("email", value)
              .andWhere("eventUuid", String(field.meta.eventId))
              .first()) === null,
        )
        .optional()
        .requiredIfMissing("participantSlug"),
      participantSlug: vine.string().optional().requiredIfMissing("email"),
    })
    .allowUnknownProperties(),
);
