import { HttpContext } from "@adonisjs/core/http";

import Email from "#models/email";
import Event from "#models/event";
import Participant from "#models/participant";
import { EmailService } from "#services/email_service";
import {
  emailDuplicateValidator,
  emailsStoreValidator,
  emailsUpdateValidator,
} from "#validators/emails";

export default class EmailsController {
  /**
   * @index
   * @operationId listEmails
   * @description Retrieve a list of emails for a specific event without content, along with their sending status.
   * @tag emails
   * @responseBody 200 - [ { "uuid": 1, "eventId": 5, "name": "test124", "trigger": "participant_registered", "triggerValue": "", "triggerValue2": "", "createdAt": "2025-02-22T19:13:10.471+00:00", "updatedAt": "2025-02-22T19:13:10.471+00:00", "meta": { "failedCount": "1", "pendingCount": "1", "sentCount": "0" } } ]
   */
  async index({ params, bouncer }: HttpContext) {
    const eventId = Number(params.eventId);
    await bouncer.authorize("manage_email", await Event.findOrFail(eventId));

    const emails = await Email.query()
      .where("eventUuid", eventId)
      .select([
        "uuid",
        "name",
        "trigger",
        "triggerValue",
        "triggerValue_2",
        "createdAt",
        "updatedAt",
      ])
      .withCount("participants", (q) =>
        q.where("status", "failed").as("failedCount"),
      )
      .withCount("participants", (q) =>
        q.where("status", "pending").as("pendingCount"),
      )
      .withCount("participants", (q) =>
        q.where("status", "sent").as("sentCount"),
      );

    return emails;
  }

  /**
   * @show
   * @operationId getEmail
   * @description Retrieve details of a specific email linked to an event.
   * @tag emails
   * @responseBody 200 - { "uuid": 1, "eventId": 5, "name": "test124", "content": "uuuu", "trigger": "participant_registered", "triggerValue": "eeee", "triggerValue2": "", "createdAt": "2025-02-22T19:13:10.471+00:00", "updatedAt": "2025-02-22T19:13:10.471+00:00", "participants": [ { "uuid": 4, "email": "dasd", "eventId": 5, "firstName": "fdf", "lastName": "fddfd", "createdAt": "2025-02-22T19:13:10.471+00:00", "updatedAt":  "2025-02-22T19:13:10.471+00:00", "meta": { "pivot_status": "failed", "pivot_email_id": 1, "pivot_participant_id": 4, "pivot_send_at":  "2025-02-22T19:13:10.471+00:00", "pivot_send_by":  "2025-02-22T19:13:10.471+00:00" } }, { "uuid": 4, "email": "dasd", "eventId": 5, "firstName": "fdf", "lastName": "fddfd", "createdAt":  "2025-02-22T19:13:10.471+00:00", "updatedAt":  "2025-02-22T19:13:10.471+00:00", "meta": { "pivot_status": "pending", "pivot_email_id": 1, "pivot_participant_id": 4, "pivot_send_at":  "2025-02-22T19:13:10.471+00:00", "pivot_send_by":  "2025-02-22T19:13:10.471+00:00" } } ] }
   * @responseBody 404 - {"message": "Email not found"}
   */
  async show({ params, bouncer }: HttpContext) {
    const emailId = +params.uuid;
    const event = await Event.findOrFail(params.eventId);
    await bouncer.authorize("manage_email", event);

    const email = Email.query()
      .preload("participants", (q) => q.pivotColumns(["status"]))
      .where("uuid", emailId)
      .where("eventUuid", event.uuid)
      .firstOrFail();

    return email;
  }

  /**
   * @store
   * @operationId createEmail
   * @description Create a new email associated with a specific event.
   * @tag emails
   * @requestBody <emailsStoreValidator>
   * @responseBody 201 - {"uuid": 1, "name": "Email Name", "content": "Email Content", "trigger": "participant_registered"}
   * @responseBody 400 - {"message": "Failed to create email"}
   */
  async store({ params, request, response, bouncer }: HttpContext) {
    const event = await Event.findOrFail(+params.eventId);
    await bouncer.authorize("manage_email", event);

    const data = await request.validateUsing(emailsStoreValidator);

    const email = await event.related("emails").create({ ...data });

    return response.status(201).send(email);
  }

  /**
   * @update
   * @operationId updateEmail
   * @description Update an existing email associated with a specific event and return the updated email.
   * @tag emails
   * @requestBody <emailsUpdateValidator>
   * @responseBody 200 - {"uuid": 1, "name": "Updated Name", "content": "Updated Content", "trigger": "form_filled"}
   */
  async update({ params, request, bouncer }: HttpContext) {
    await bouncer.authorize(
      "manage_email",
      await Event.findOrFail(params.eventId),
    );

    const data = await request.validateUsing(emailsUpdateValidator);
    const emailId = Number(params.uuid);
    const email = await Email.findOrFail(emailId);

    await email.merge(data).save();

    return email;
  }

  /**
   * @destroy
   * @operationId deleteEmail
   * @description Remove an email associated with a specific event.
   * @tag emails
   * @responseBody 200 - { message: "Email successfully deleted" }
   */
  async destroy({ params, bouncer }: HttpContext) {
    await bouncer.authorize(
      "manage_email",
      await Event.findOrFail(params.eventId),
    );

    const emailId = Number(params.uuid);
    const email = await Email.findOrFail(emailId);

    await email.related("participants").detach();
    await email.delete();

    return { message: "Email successfully deleted" };
  }

  /**
   * @send
   * @operationId sendEmail
   * @description Send an email to a list of participants.
   * @tag emails
   * @requestBody { "participants": [1, 2, 3] }
   * @responseBody 200 - { message: "Emails successfully sent"}
   */
  async send({ params, request, bouncer, auth }: HttpContext) {
    const emailId = Number(params.emailId);
    const event = await Event.findOrFail(params.eventId);
    await bouncer.authorize("manage_email", event);

    const email = await Email.query()
      .where("eventUuid", event.uuid)
      .where("uuid", emailId)
      .firstOrFail();
    const participants = await Participant.query()
      .whereIn("uuid", request.input("participants") as number[])
      .where("eventUuid", event.uuid);

    for (const participant of participants) {
      await EmailService.sendToParticipant(
        event,
        participant,
        email,
        `${auth.user?.firstName} ${auth.user?.lastName}`,
      );
    }

    return { message: "Emails successfully sent" };
  }

  /**
   * @duplicate
   * @operationId duplicateEmail
   * @description duplicate an email
   * @tag emails
   * @requestBody { <emailDuplicateValidator> }
   * @responseBody 201 - <Email>.append("meta" : {} )
   */
  async duplicate({ params, request, response, bouncer }: HttpContext) {
    const emailId = Number(params.emailId);
    const event = await Event.findOrFail(params.eventId);
    await bouncer.authorize("manage_email", event);

    const email = await Email.query()
      .where("eventUuid", event.uuid)
      .where("uuid", emailId)
      .firstOrFail();

    const data = await request.validateUsing(emailDuplicateValidator);

    // Copy + cleanup of original data so adonis does create a new record instead of overwriting
    const emailData = {
      ...email.$original,
    };
    delete emailData.uuid;
    delete emailData.createdAt;
    delete emailData.updatedAt;

    const newEmail = await event.related("emails").create({
      ...emailData,
      ...data,
    });

    return response.created(newEmail);
  }
}
