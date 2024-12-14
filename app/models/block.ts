import { BaseModel, column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";

export default class Block extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  // @hasOne(() => Attribute)
  // declare id: HasOne<typeof Attribute>;

  @column()
  declare name: string;

  @column()
  declare description: string | null;

  @column()
  declare parent_id: number | null;

  // @hasOne(() => Block)
  // declare parent_id: HasOne<typeof Block>;

  @column()
  declare capacity: number | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
