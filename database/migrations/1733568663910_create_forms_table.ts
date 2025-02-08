import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "forms";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.integer("event_id").unsigned();
      table.boolean("is_open").defaultTo(false).nullable();
      table.text("description", "long").nullable();
      table.string("name").notNullable();
      table.timestamp("start_date").defaultTo("NOW()");
      table.timestamp("end_date").nullable();
      table.timestamps();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
