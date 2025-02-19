import Event from "#models/event";
import type { HttpContext } from "@adonisjs/core/http";
import { createEventLimitedValidator, updateEventValidator } from "#validators/event";

export default class EventController {
  /**
   * @index
   * @operationId getEvents
   * @description Returns paginated list of events with their participants
   * @paramQuery page - Page number for pagination - @type(number)
   * @paramQuery perPage - Number of items per page - @type(number)
   * @responseBody 200 - <Event[]>.with(participants)
   * @responseHeader 200 - @use(paginated)
   * @tag event
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));
    return await Event.query().preload("participants").paginate(page, perPage);
  }

  /**
   * @show
   * @operationId getEventById
   * @description Returns a single event with its participants
   * @paramPath id - Event identifier - @type(number) @required
   * @responseBody 200 - <Event>.with(participants)
   * @responseBody 404 - Event not found
   * @tag event
   */
  public async show({ params }: HttpContext) {
    const eventId = Number(params.id);
    return await Event.query().preload("participants").where("id", eventId).firstOrFail();
  }

  /**
   * @findEventsByOrganizerId
   * @operationId getEventsByOrganizerId
   * @description Returns paginated list of events for the authenticated organizer
   * @paramQuery page - Page number for pagination - @type(number)
   * @paramQuery perPage - Number of items per page - @type(number)
   * @responseBody 200 - <Event[]>.with(participants)
   * @responseHeader 200 - @use(paginated)
   * @responseBody 401 - Unauthorized access
   * @tag event
   */
  public async findEventsByOrganizerId({ request, auth }: HttpContext) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));
    const organizerId = auth.user!.id;
    return Event.query()
      .select(
        "id",
        "organizerId",
        "name",
        "slug",
        "startDate",
        "endDate",
        "firstFormId",
        "lat",
        "long",
        "primaryColor",
        "secondaryColor",
        "createdAt",
        "updatedAt"
      )
      .where("organizerId", organizerId)
      .preload("participants")
      .paginate(page, perPage);
  }

  /**
   * @findEventById
   * @operationId findEventById
   * @description Returns a single event if user has permission to view it
   * @paramPath id - Event identifier - @type(number) @required
   * @responseBody 200 - <Event>.with(participants)
   * @responseBody 403 - Not authorized to access this event
   * @responseBody 404 - Event not found
   * @tag event
   */
  public async findEventById({ params, response, bouncer }: HttpContext) {
    const eventId = Number(params.id);
    const event = await Event.findOrFail(eventId);
    await bouncer.authorize('read_event', event);
    return response.json(event);
  }

  /**
   * @store
   * @operationId createEvent
   * @description Creates a new event for the authenticated user
   * @requestBody <createEventLimitedValidator>
   * @responseBody 201 - <Event>
   * @responseBody 400 - Invalid input data
   * @responseBody 401 - Unauthorized access
   * @responseBody 422 - Validation failed
   * @tag event
   */
  public async store({ request, response, auth }: HttpContext) {
    const data = await createEventLimitedValidator.validate(request.all());
    const savedEvent = await Event.create({ ...data, organizerId: auth?.user?.id });
    return response.created(savedEvent);
  }

  /**
   * @update
   * @operationId updateEvent
   * @description Updates an existing event if user has permission
   * @paramPath id - Event identifier - @type(number) @required
   * @requestBody <updateEventValidator>
   * @responseBody 200 - <Event>
   * @responseBody 400 - Invalid input data
   * @responseBody 403 - Not authorized to update this event
   * @responseBody 404 - Event not found
   * @responseBody 422 - Validation failed
   * @tag event
   */
  public async update({ params, request, response, bouncer }: HttpContext) {
    const eventId = Number(params.id);
    const event = await Event.findOrFail(eventId);
    await bouncer.authorize('update_event', event);
    const data = await updateEventValidator.validate(request.all());
    event.merge(data);
    const updatedEvent = await event.save();
    return response.ok(updatedEvent);
  }

  /**
   * @destroy
   * @operationId deleteEvent
   * @description Deletes an event if user has permission
   * @paramPath id - Event identifier - @type(number) @required
   * @responseBody 204 - {}
   * @responseBody 403 - Not authorized to delete this event
   * @responseBody 404 - Event not found
   * @tag event
   */
  public async destroy({ params, response, bouncer }: HttpContext) {
    const eventId = Number(params.id);
    const event = await Event.findOrFail(eventId);
    await bouncer.authorize('delete_event', event);
    await event.delete();
    return response.noContent();
  }
}
