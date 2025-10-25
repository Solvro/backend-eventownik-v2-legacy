import { DateTime } from "luxon";

import { cuid } from "@adonisjs/core/helpers";
import { Message } from "@adonisjs/mail";
import mail from "@adonisjs/mail/services/main";

import Block from "#models/block";
import Email from "#models/email";
import Event from "#models/event";
import Participant from "#models/participant";
import env from "#start/env";

import { EmailTriggerType } from "../types/trigger_types.js";

export class EmailService {
  static async sendOnTrigger(
    event: Event,
    participant: Participant,
    trigger: EmailTriggerType,
    triggerValue?: string | number, // used for example as attribute id in trigger attribute_changed
    triggerValue2?: string | null, // used for example as attribute value in trigger attribute_changed
  ) {
    const email = await Email.query()
      .where("eventUuid", event.uuid)
      .where("trigger", trigger)
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      .if(triggerValue, (query) => query.where("triggerValue", triggerValue!))
      .if(triggerValue2, (query) =>
        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        query.where("trigger_value_2", triggerValue2!),
      )
      .first();

    if (email === null) {
      return;
    }

    await this.sendToParticipant(event, participant, email);
  }

  static async sendToParticipant(
    event: Event,
    participant: Participant,
    email: Email,
    sendBy = "system",
  ) {
    await email.load("form");
    await participant
      .related("emails")
      .attach({ [email.uuid]: { status: "pending", send_by: sendBy } });
    await participant.load("attributes", (q) => q.pivotColumns(["value"]));
    await event.load("mainOrganizer");

    await mail.sendLater(async (message) => {
      message
        .to(participant.email)
        .from("eventownik@solvro.pl", event.name)
        .subject(email.name)
        .replyTo(event.contactEmail ?? event.mainOrganizer.email)
        .html(await this.parseContent(event, participant, email, message));

      await participant
        .related("emails")
        .sync(
          { [email.uuid]: { status: "sent", send_at: DateTime.now() } },
          false,
        );
    });
  }

  static async parseContent(
    event: Event,
    participant: Participant,
    email: Email,
    message: Message,
  ) {
    const content = email.content;
    const { form } = email;
    let parsedContent = content
      .replace(/\/event_name/g, event.name)
      .replace(
        /\/event_start_date/g,
        event.startDate.toFormat("yyyy-MM-dd HH:mm"),
      )
      .replace(/\/event_end_date/g, event.endDate.toFormat("yyyy-MM-dd HH:mm"))
      // .replace(/\/event_slug/g, event.slug)
      .replace(/\/event_primary_color/g, event.primaryColor ?? "")
      .replace(/\/event_location/g, event.location ?? "")
      .replace(/\/participant_id/g, String(participant.uuid))
      .replace(
        /\/participant_created_at/g,
        participant.createdAt.toFormat("yyyy-MM-dd HH:mm"),
      )
      .replace(
        /\/participant_updated_at/g,
        participant.updatedAt.toFormat("yyyy-MM-dd HH:mm"),
      )
      .replace(/\/participant_email/g, participant.email)
      .replace(
        /data:image\/(\w+);base64,([^"]+)/g,
        (_match, format, base64: string) => {
          const cid = cuid();
          message.nodeMailerMessage.attachments =
            message.nodeMailerMessage.attachments ?? [];
          message.nodeMailerMessage.attachments.push({
            content: Buffer.from(base64, "base64"),
            encoding: "base64",
            filename: `${cid}.${format}`,
            cid,
          });
          return `cid:${cid}`;
        },
      );

    if (form !== null) {
      parsedContent = parsedContent.replace(
        /\/form_url/g,
        // TODO:
        `${env.get("APP_DOMAIN")}/${event.slug}/${form.uuid}/${participant.uuid}`,
      );
    }

    for (const attribute of participant.attributes) {
      if (attribute.type === "block") {
        const block = await Block.find(attribute.$extras.pivot_value);
        attribute.$extras.pivot_value =
          block?.name ?? (attribute.$extras.pivot_value as string);
      }
      parsedContent = parsedContent.replace(
        new RegExp(`/participant_${attribute.slug}`, "g"),
        attribute.$extras.pivot_value as string,
      );
    }

    return parsedContent;
  }
}
