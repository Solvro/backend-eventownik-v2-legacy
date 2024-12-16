import { BaseModel, column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare firstName: string;

  @column()
  declare lastName: string;

  @column()
  declare password: string;

  @column()
  declare email: string;

  @column()
  declare type: "organizer" | "superadmin";

  @column()
  declare active: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
