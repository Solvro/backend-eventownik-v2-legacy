import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import Attribute from "#models/attribute";
import Event from "#models/event";
import Participant from "#models/participant";
import { FileService } from "#services/file_service";
import { participantBulkUpdateValidator } from "#validators/participant_attributes";

@inject()
export default class ParticipantsAttributesController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private fileService: FileService) {}

  /**
   * @downloadFile
   * @operationId downloadFile
   * @description Returns attribute file
   * @tag attributes
   * @responseBody 200 - photo
   * @responseBody 400 - { message: "Event doesn't have a photo" }
   */
  public async downloadFile({ params, response, bouncer }: HttpContext) {
    const eventId = +params.eventId;
    const participantId = +params.participantId;
    const attributeId = +params.attributeId;

    await bouncer.authorize(
      "manage_participant",
      await Event.findOrFail(eventId),
    );

    const participant = await Participant.query()
      .where("id", participantId)
      .andWhere("event_id", eventId)
      .first();

    if (participant === null) {
      return response.badRequest({
        message: "Participant doesn't exists",
      });
    }

    const { participantAttributes } = await Attribute.query()
      .where("id", attributeId)
      .preload("participantAttributes", (participantAttributesQuery) =>
        participantAttributesQuery
          .where("participant_id", participantId)
          .pivotColumns(["value"]),
      )
      .firstOrFail();

    const filename = participantAttributes[0].$extras.pivot_value as string;

    const filePath = await this.fileService.getFileAbsolutePath(filename);

    if (filePath !== undefined) {
      return response.download(filePath);
    } else {
      response.notFound({ message: "Attribute doesn't have a file" });
    }
  }

  /**
   * @bulkUpdate
   * @operationId bulkUpdate
   * @description Update many participants attributes at once.
   * @tag participants
   * @requestBody {"participantIds": [1, 2, 3], "newValue": "new value"}
   * @responseBody 204 - No Content
   * @responseBody 401 - Unauthorized access
   * @responseBody 404 - Event not found
   */

  async bulkUpdate({ params, request, bouncer, response }: HttpContext) {
    const eventId = +params.eventId;
    const attributeId = +params.attributeId;
    const { newValue, participantIds } = await request.validateUsing(
      participantBulkUpdateValidator,
      {
        meta: {
          eventId,
        },
      },
    );

    await bouncer.authorize(
      "manage_participant",
      await Event.findOrFail(eventId),
    );

    const updatedParticipantAttributes = participantIds.reduce<
      Record<number, { value: string }>
    >((acc, id) => {
      acc[id] = { value: newValue };
      return acc;
    }, {});

    const attribute = await Attribute.findOrFail(attributeId);
    await attribute
      .related("participantAttributes")
      .sync(updatedParticipantAttributes, false);

    return response.noContent();
  }
}
