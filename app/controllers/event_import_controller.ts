import type { HttpContext } from "@adonisjs/core/http";

import Event from "#models/event";
import Participant from "#models/participant";
import { ParticipantService } from "#services/participant_service";
import { participantsImportValidator } from "#validators/participants";

interface SkippedParticipant {
  email: string;
  reason: "already_exists" | "duplicate_in_file" | "failed";
  message: string;
}

export default class EventImportController {
  private participantService = new ParticipantService();

  /**
   * @handle
   * @summary Import participants
   * @operationId importEventParticipants
   * @description Bulk creates participants for :eventId. Existing emails are skipped and returned as warnings.
   * @tag participants
   * @paramPath eventId - ID of the event to import participants into - @type(number) @required
   * @requestBody {"participants":[{"email":"anna@example.com","participantAttributes":[{"attributeId":1,"value":"VIP"}]}]}
   * @responseBody 200 - {"eventId":"<number>","importedParticipants":"<Participant[]>","skippedParticipants":"<{ email: string; reason: string; message: string }[]>"}
   * @responseBody 409 - {"message":"Nie zaimportowano żadnych uczestników.","skippedParticipants":"<{ email: string; reason: string; message: string }[]>"}
   */
  public async handle({ params, request, response, bouncer }: HttpContext) {
    const eventId = +params.eventId;
    const event = await Event.findOrFail(eventId);

    await bouncer.authorize("manage_participant", event);

    const { participants } = await request.validateUsing(
      participantsImportValidator,
    );
    const normalizedParticipants = participants.map((participant) => ({
      ...participant,
      email: participant.email.trim().toLowerCase(),
    }));
    const emails = normalizedParticipants.map(
      (participant) => participant.email,
    );

    const existingParticipants = await Participant.query()
      .where("event_id", eventId)
      .whereIn("email", [...new Set(emails)])
      .select("email");
    const existingEmails = new Set(
      existingParticipants.map((participant) =>
        participant.email.trim().toLowerCase(),
      ),
    );
    const importedParticipants: Participant[] = [];
    const skippedParticipants: SkippedParticipant[] = [];
    const seenEmails = new Set<string>();

    for (const participant of normalizedParticipants) {
      if (existingEmails.has(participant.email)) {
        skippedParticipants.push({
          email: participant.email,
          reason: "already_exists",
          message: "Uczestnik z tym adresem email już istnieje.",
        });
        continue;
      }

      if (seenEmails.has(participant.email)) {
        skippedParticipants.push({
          email: participant.email,
          reason: "duplicate_in_file",
          message: "Ten adres email występuje w pliku więcej niż raz.",
        });
        continue;
      }

      seenEmails.add(participant.email);

      try {
        const importedParticipant =
          await this.participantService.createParticipant(eventId, participant);
        importedParticipants.push(importedParticipant);
      } catch (error) {
        skippedParticipants.push({
          email: participant.email,
          reason: "failed",
          message:
            error instanceof Error
              ? error.message
              : "Nie udało się zaimportować uczestnika.",
        });
      }
    }

    if (importedParticipants.length === 0) {
      return response.conflict({
        message: "Nie zaimportowano żadnych uczestników.",
        skippedParticipants,
      });
    }

    return response.ok({
      eventId,
      importedParticipants,
      skippedParticipants,
      warning:
        skippedParticipants.length > 0
          ? {
              message: "Część uczestników nie została zaimportowana.",
              emails: skippedParticipants.map(
                (participant) => participant.email,
              ),
            }
          : null,
    });
  }
}
