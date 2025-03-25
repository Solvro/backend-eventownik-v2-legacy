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
    startDate: vine
      .date({
        formats: { format: "iso8601" },
      })
      .transform(dateTimeTransform),
    endDate: vine
      .date({
        formats: { format: "iso8601" },
      })
      .transform(dateTimeTransform)
      .optional(),
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
        vine.string().normalizeUrl({
          normalizeProtocol: true,
          forceHttps: true,
          stripWWW: false,
          removeExplicitPort: true,
        }),
      )
      .nullable()
      .optional(),
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
    startDate: vine
      .date({
        formats: { format: "iso8601" },
      })
      .transform(dateTimeTransform)
      .optional(),
    endDate: vine
      .date({
        formats: { format: "iso8601" },
      })
      .transform(dateTimeTransform)
      .optional(),
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
        vine.string().normalizeUrl({
          normalizeProtocol: true,
          forceHttps: true,
          stripWWW: false,
          removeExplicitPort: true,
        }),
      )
      .nullable()
      .optional(),
  }),
);
