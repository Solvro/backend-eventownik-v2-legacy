import vine from "@vinejs/vine";
import { FieldContext } from "@vinejs/vine/types";
import { DateTime } from "luxon";

import string from "@adonisjs/core/helpers/string";

function dateTimeTransform(value: Date): DateTime {
  const parsed = DateTime.fromISO(value.toISOString());
  if (!parsed.isValid) {
    throw new Error("Invalid date");
  }
  return parsed;
}

const slugMinLength = vine.createRule(
  async (value, minLength: number, field: FieldContext) => {
    if (typeof value !== "string") {
      field.report("Slug must be a string", "slugMinLength", field);
    } else {
      const sluggedValue = string.slug(value, { lower: true });
      if (sluggedValue.length < minLength) {
        field.report(
          `Slug must be at least ${minLength} characters long`,
          "slugMinLength",
          field,
        );
      }
    }
  },
);

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255),
    description: vine.string().nullable().optional(),
    organizer: vine.string().nullable().optional(),
    slug: vine
      .string()
      .unique(
        async (db, value) =>
          (await db
            .from("events")
            .where("slug", string.slug(value, { lower: true }))
            .first()) === null,
      )
      .use(slugMinLength(3))
      .transform((value) => string.slug(value, { lower: true })),
    // 2025-01-05 12:00:00
    startDate: vine.date().transform(dateTimeTransform),
    endDate: vine.date().transform(dateTimeTransform),
    lat: vine.number().nullable().optional(),
    location: vine.string().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    contactEmail: vine.string().nullable().optional(),
    participantsCount: vine.number().nullable().optional(),
    photo: vine
      .file({
        size: "10mb",
        extnames: ["jpg", "jpeg", "png", "gif"],
      })
      .optional(),
    socialMediaLinks: vine
      .array(
        vine
          .string()
          .regex(/^(https?:\/\/[^\s]+|\[.*\]\(https?:\/\/[^\s)]+\))$/),
      )
      .nullable()
      .optional(),
    termsLink: vine.string().nullable().optional(),
  }),
);

export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).optional(),
    description: vine.string().nullable().optional(),
    slug: vine
      .string()
      .unique(
        async (db, value, field) =>
          (await db
            .from("events")
            .where("slug", string.slug(value, { lower: true }))
            .whereNot("id", +field.meta.eventId)
            .first()) === null,
      )
      .use(slugMinLength(3))
      .transform((value) => string.slug(value, { lower: true }))
      .optional(),
    startDate: vine.date().transform(dateTimeTransform).optional(),
    endDate: vine.date().transform(dateTimeTransform).optional(),
    location: vine.string().nullable().optional(),
    contactEmail: vine.string().nullable().optional(),
    lat: vine.number().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    participantsCount: vine.number().nullable().optional(),
    organizer: vine.string().nullable().optional(),
    photo: vine
      .file({
        size: "10mb",
        extnames: ["jpg", "jpeg", "png", "git"],
      })
      .nullable()
      .optional(),
    socialMediaLinks: vine
      .array(
        vine
          .string()
          .regex(/^(https?:\/\/[^\s]+|\[.*\]\(https?:\/\/[^\s)]+\))$/),
      )
      .nullable()
      .optional(),
    termsLink: vine.string().nullable().optional(),
  }),
);

export const displayEvents = vine.compile(
  vine.object({
    from: vine.date().optional().transform(dateTimeTransform),
    to: vine.date().optional().transform(dateTimeTransform),
  }),
);

export const toggleEventActivation = vine.compile(
  vine.object({
    isActive: vine.boolean(),
  }),
);
