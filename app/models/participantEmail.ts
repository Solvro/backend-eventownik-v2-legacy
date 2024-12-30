import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Participant from "#models/participant";
import Email from "#models/email";

export default class ParticipantEmail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare participantId: number;

  @column()
  declare emailId: number;

  @column.dateTime()
  declare sendAt: DateTime | null;

  @column()
  declare sendBy: string | null;

  @column()
  declare status: "pending" | "sent" | "failed";

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Participant)
  declare participant: BelongsTo<typeof Participant>;

  @belongsTo(() => Email)
  declare email: BelongsTo<typeof Email>;
}
