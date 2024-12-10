import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "admin_permissions";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.integer("event_id").unsigned().notNullable();
      // .references("events.id");
      table
        .integer("permission_id")
        .unsigned()
        .notNullable()
        .references("permissions.id");
      table
        .integer("admin_id")
        .unsigned()
        .notNullable()
        .references("admins.id");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
