import vine from "@vinejs/vine";

export const createAdminValidator = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    password: vine.string(),
    email: vine
      .string()
      .email()
      .unique(
        async (db, value) =>
          !(await db.from("admins").where("email", value).first()),
      ),
    type: vine.enum(["organizer", "superadmin"]),
    active: vine.boolean().optional(),
    permissions: vine
      .array(
        vine.object({
          permissionId: vine.number(),
          eventId: vine.number(),
        }),
      )
      .optional(),
  }),
);

export const updateAdminValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    password: vine.string().optional(),
    email: vine
      .string()
      .email()
      .unique(
        async (db, value) =>
          !(await db.from("admins").where("email", value).first()),
      )
      .optional(),
    type: vine.enum(["organizer", "superadmin"]).optional(),
    active: vine.boolean().optional(),
  }),
);
