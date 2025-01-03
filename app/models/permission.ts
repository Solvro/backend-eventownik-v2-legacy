import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";

import Admin from "./admin.js";

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare action: string;

  @column()
  declare subject: string;

  @manyToMany(() => Admin, {
    pivotTable: "admin_permissions",
    pivotColumns: ["eventId"],
    pivotTimestamps: true,
  })
  declare admins: ManyToMany<typeof Admin>;
}
