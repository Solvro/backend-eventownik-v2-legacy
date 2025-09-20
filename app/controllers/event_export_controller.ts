import ExcelJS from "exceljs";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

import Event from "#models/event";
import Participant from "#models/participant";
import { AttributeService } from "#services/attribute_service";
import env from "#start/env";

@inject()
export default class EventExportController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private attributeService: AttributeService) {}

  /**
   * @handle
   * @summary Export participants
   * @operationId exportEventSpreadsheet
   * @description Returns file to download of spreadsheet with all participants of given :eventId
   * @tag participants
   * @paramPath eventId - ID of the event to be exported - @type(number) @required
   * @paramQuery ids - Users to only include in export file - @type(number[].join(",")) @example(?ids=2, or ?ids=3,4)
   * @responseBody 200 - file:xlsx - Spreadsheet download with xlsx extension
   * @responseBody 404 - { message: "Row not found", "name": "Exception", status: 404 },
   */
  public async handle({ params, response, request }: HttpContext) {
    const event = await Event.query()
      .where("uuid", +params.eventId)
      .preload("participants", async (participants) => {
        await participants.preload("attributes");
      })
      .firstOrFail();

    const attributes = await this.attributeService.getEventAttributes(
      event.uuid,
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Export");

    const attributesColumns = attributes.map((attribute) => {
      return { header: attribute.name, key: attribute.name };
    });

    sheet.columns = [
      { header: "uuid", key: "participants_id" },
      { header: "email", key: "participants_email" },
      ...attributesColumns,
    ];

    const queryParams = request.qs();

    let sortedParticipants = event.participants.sort(
      (p1, p2) => p1.id - p2.id,
    ) as Participant[];

    if (queryParams.uuids !== undefined) {
      const participantsToFilter = (
        typeof queryParams.uuids === "string"
          ? queryParams.uuids.split(",")
          : (queryParams.uuids as string[])
      )
        .filter((v) => v.trim() !== "")
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));

      sortedParticipants = sortedParticipants.filter(
        (participant) =>
          participantsToFilter.findIndex((id) => id === participant.uuid) > -1,
      );
    }

    sheet.getColumn("participants_id").values = ["uuid"].concat(
      sortedParticipants.map((participant) => participant.uuid.toString()),
    );
    sheet.getColumn("participants_email").values = ["Email"].concat(
      sortedParticipants.map((participant) => participant.email),
    );

    for (const attribute of attributesColumns) {
      const attributeValues: string[] = [];

      attributeValues.push(attribute.header);

      for (const participantWithAttributes of sortedParticipants) {
        const foundAttribute = participantWithAttributes.attributes.find(
          (participantAttribute) => participantAttribute.name === attribute.key,
        );

        if (foundAttribute !== undefined) {
          attributeValues.push(foundAttribute.$extras.pivot_value as string);
        } else {
          attributeValues.push("N/A");
        }
      }

      sheet.getColumn(attribute.key).values = attributeValues;
    }

    const tempFolderPath = app.makePath(
      env.get("TEMP_STORAGE_URL", "storage/temp"),
    );

    if (!existsSync(tempFolderPath)) {
      mkdirSync(tempFolderPath, { recursive: true });
    }

    const tempWorksheetFilePath = path.join(tempFolderPath, "worksheet.xlsx");

    await workbook.xlsx.writeFile(tempWorksheetFilePath);

    response.download(tempWorksheetFilePath);
  }
}
