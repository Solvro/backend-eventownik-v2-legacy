import Admin from "#models/admin";
import { HttpContext } from "@adonisjs/core/http";

export default class OrganizersController {
  /**
   * @index
   * @operationId getEventOrganizers
   * @description Return an array of organizers of specified event
   * @tag organizers
   * @responseBody 200 - <Admin[]>
   */
  async index(context: HttpContext) {
    const eventId = +context.params.eventId;

    return await Admin.query()
      .select("firstName", "lastName", "email")
      .whereHas("events", (query) => query.where("events.id", eventId));
  }
}
