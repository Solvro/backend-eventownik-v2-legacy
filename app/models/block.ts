import { BaseModel, column, hasMany, hasOne } from "@adonisjs/lucid/orm";
import type { HasMany, HasOne } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

export default class Block extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  // @belongsTo(() => Attribute)
  // declare attribute: HasOne<typeof Attribute>;

  @column()
  declare name: string;

  @column()
  declare description: string | null;

  @column()
  declare parentId: number | null;

  @hasOne(() => Block)
  declare parent: HasOne<typeof Block>;

  @hasMany(() => Block)
  declare children: HasMany<typeof Block>;

  @column()
  declare capacity: number | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
