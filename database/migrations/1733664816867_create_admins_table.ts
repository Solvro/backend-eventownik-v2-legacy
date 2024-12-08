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
      table.text("type").notNullable();
      table.boolean("active").notNullable();

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
