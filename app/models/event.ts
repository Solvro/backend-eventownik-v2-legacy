import {
  BaseModel,
  /*belongsTo,*/
  column,
  hasMany,
} from "@adonisjs/lucid/orm";
import type {
  /*BelongsTo,*/
  HasMany,
} from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import Participant from "./participant.js";

// import Admin from './Admin.ts';
// import Form from './Form.ts';

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare organizerId: number;

  @column()
  declare name: string;

  @column()
  declare description: string | null;

  @column()
  declare slug: string;

  @column.dateTime()
  declare startDate: DateTime;

  @column.dateTime()
  declare endDate: DateTime;

  @column()
  declare firstFormId: number | null;

  @column()
  declare lat: number | null;

  @column()
  declare long: number | null;

  @column()
  declare primaryColor: string | null;

  @column()
  declare secondaryColor: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  // @belongsTo(() => Admin)
  // public organizer: BelongsTo<typeof Admin>;

  // @belongsTo(() => Form)
  // public firstForm: BelongsTo<typeof Form>;

  @hasMany(() => Participant)
  declare participants: HasMany<typeof Participant>;
}
