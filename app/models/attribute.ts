import { BaseModel, column, manyToMany, belongsTo, BelongsTo, ManyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import ParticipantAttribute from './ParticipantAttribute'
import Event from './Event'
import Form from './Form'
// import Block from './Block'
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

  @belongsTo(() => Event, {
    foreignKey: 'eventId',
  })
  public event: BelongsTo<typeof Event>

  // @belongsTo(() => Block, {
  //   foreignKey: 'rootBlockId',
  // })
  // public rootBlock: BelongsTo<typeof Block>

  @manyToMany(() => Form, {
    pivotTable: 'form',
  })
  public forms: ManyToMany<typeof Form>

  @manyToMany(() => ParticipantAttribute, {
    pivotTable: 'participant_attribute',
    pivotColumns: ['value'],
  })
  public participantAttributes: ManyToMany<typeof ParticipantAttribute>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
