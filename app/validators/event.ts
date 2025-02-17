import vine from "@vinejs/vine";
import { DateTime } from "luxon";

function dateTimeTransform(value: Date): DateTime {
  const parsed = DateTime.fromISO(value.toISOString());
  if (!parsed.isValid) {
    throw new Error("Invalid date");
  }
  return parsed;
}

export const createEventValidator = vine.compile(
  vine.object({
    //organizerId: vine.number(),
    name: vine.string().maxLength(255),
    description: vine.string().nullable().optional(),
    slug: vine.string(),
    startDate: vine.date().transform(dateTimeTransform),
    endDate: vine.date().transform(dateTimeTransform),
    //firstFormId: vine.number().nullable().optional(),
    lat: vine.number().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    secondaryColor: vine.string().nullable().optional(),
  }),
);

export const updateEventValidator = vine.compile(
  vine.object({
    //organizerId: vine.number().optional(),
    name: vine.string().maxLength(255).optional(),
    description: vine.string().nullable().optional(),
    slug: vine.string().optional(),
    startDate: vine.date().transform(dateTimeTransform).optional(),
    endDate: vine.date().transform(dateTimeTransform).optional(),
    //firstFormId: vine.number().nullable().optional(),
    lat: vine.number().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    secondaryColor: vine.string().nullable().optional(),
  }),
);
