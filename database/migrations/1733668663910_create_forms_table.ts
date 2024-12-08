import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'forms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.boolean('is_open').nullable()
      table.timestamp('end_date').nullable()
      table.text('description').nullable()
      table.string('name').notNullable()
      table.timestamp('start_date')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}