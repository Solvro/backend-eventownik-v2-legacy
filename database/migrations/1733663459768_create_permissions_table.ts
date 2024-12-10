import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "permissions";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.text("action").notNullable();
      table.text("subject").notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
