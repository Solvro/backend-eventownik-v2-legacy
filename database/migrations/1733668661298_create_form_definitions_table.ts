import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'form_definitions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('attribute_id').unsigned().references('id').inTable('attrubutes').onDelete('CASCADE')
      table.integer('form_id').unsigned().references('id').inTable('forms').onDelete('CASCADE')
      table.boolean('is_editable').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}