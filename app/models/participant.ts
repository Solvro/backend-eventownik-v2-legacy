import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
// import ParticipantAttribute from 'App/Models/participantAttribute.ts'

export default class Participant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare eventId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @hasMany(() => ParticipantAttribute)
  // declare attributes: HasMany<typeof ParticipantAttribute>
}