import { BaseModel, column, hasMany, HasMany} from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import ParticipantAttribute from './ParticipantAttribute'

export default class Attribute extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string | null

  @column()
  declare eventId: number | null

  @column()
  declare options: object | null

  @column()
  declare type: string | null

  @column()
  declare rootBlockId: number | null

  @hasMany(() => ParticipantAttribute)
  public participantAttributes: HasMany<typeof ParticipantAttribute>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
