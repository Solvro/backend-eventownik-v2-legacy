import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "blocks";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments("id")
        .references("root_block_id")
        .inTable("attributes")
        .onDelete("CASCADE");

      table.text("name");
      table.string("description", 255).nullable();
      table
        .integer("parent_block_id")
        .nullable()
        .references("id")
        .inTable("blocks")
        .onDelete("CASCADE");
      table.integer("capacity").nullable();

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
