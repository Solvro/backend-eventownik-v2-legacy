import vine from "@vinejs/vine";

export const addOrganizerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    permissionsIds: vine.array(
      vine.number().exists({ table: "permissions", column: "id" }),
    ),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    password: vine.string().optional(),
  }),
);
