import Admin from "#models/admin";
import { OrganizerService } from "#services/organizer_service";
import { addOrganizerValidator } from "#validators/organizer";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

@inject()
export default class OrganizersController {
  //eslint-disable-next-line no-useless-constructor
  constructor(private organizerService: OrganizerService) {}

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

  /**
   * @store
   * @operationId addEventOrganizer
   * @description Add an admin as an event organizer
   * @requestBody <addOrganizerValidator>
   * @tag organizers
   */
  async store({ params, request }: HttpContext) {
    const eventId = +params.eventId;

    const organizerData = await addOrganizerValidator.validate(request.all());

    await this.organizerService.addOrganizer(eventId, organizerData);
  }
}
