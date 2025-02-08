import vine from "@vinejs/vine";

export const participantsStoreValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    eventId: vine.number(),
    firstName: vine.string(),
    lastName: vine.string(),
  }),
);

export const participantsUpdateValidator = vine.compile(
  vine.object({
    email: vine.string().email().optional(),
    eventId: vine.number().optional(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
  }),
);
