import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "forms";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("event_id").references("events.id").onDelete('CASCADE');
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign("event_id");
    });
  }
}
