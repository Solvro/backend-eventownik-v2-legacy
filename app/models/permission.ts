import { BaseModel, column } from "@adonisjs/lucid/orm";

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare action: string;

  @column()
  declare subject: string;
}
