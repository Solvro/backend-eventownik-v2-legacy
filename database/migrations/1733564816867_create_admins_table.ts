import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "admins";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.text("first_name").notNullable();
      table.text("last_name").notNullable();
      table.text("password").notNullable();
      table.text("email").notNullable().unique();
      table
        .enum("type", ["organizer", "superadmin"], {
          useNative: true,
          enumName: "admin_type",
          existingType: false,
        })
        .notNullable()
        .defaultTo("organizer");
      table.boolean("active").notNullable().defaultTo(true);

      table.timestamps();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
    this.schema.raw('DROP TYPE IF EXISTS "admin_type"');
  }
}
