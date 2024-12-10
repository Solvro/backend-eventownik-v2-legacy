import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EventsSchema extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('organizer_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.text('description')
      table.string('slug', 255).notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('first_form_id').unsigned().references('id').inTable('forms').onDelete('CASCADE')
      table.text('lat')
      table.text('long')
      table.string('primary_color', 50)
      table.string('secondary_color', 50)
      table.timestamp('updated_at').notNullable()
      table.timestamp('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
