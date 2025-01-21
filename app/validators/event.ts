import vine from "@vinejs/vine";
import { DateTime } from "luxon";

function DateTimeTransform(value: Date): DateTime {
  const parsed = DateTime.fromISO(value.toISOString())
  if(!parsed.isValid) {
    throw new Error('Invalid date');
  }
  return parsed;
}

export const createEventValidator = vine.compile(
  vine.object({
    //organizerId: vine.number(),
    name: vine.string().maxLength(255),
    description: vine.string().nullable().optional(),
    //slug: vine.string(),
    startDate: vine.date().transform(DateTimeTransform),
    endDate: vine.date().transform(DateTimeTransform),
    //firstFormId: vine.number().nullable().optional(),
    lat: vine.number().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    secondaryColor: vine.string().nullable().optional(),
  })
);

export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).optional(),
    description: vine.string().nullable().optional(),
    startDate: vine.date().transform(DateTimeTransform).optional(),
    endDate: vine.date().transform(DateTimeTransform).optional(),
    //firstFormId: vine.number().nullable().optional(),
    lat: vine.number().nullable().optional(),
    long: vine.number().nullable().optional(),
    primaryColor: vine.string().nullable().optional(),
    secondaryColor: vine.string().nullable().optional(),
  })
);

export const createEventLimitedValidator = vine.compile(
  vine.object({
    //organizerId: vine.number().optional(),
    name: vine.string().maxLength(255),
    startDate: vine.date().transform(DateTimeTransform),
    endDate: vine.date().transform(DateTimeTransform),
  }),
);
