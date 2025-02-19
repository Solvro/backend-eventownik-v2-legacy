import Event from "#models/event";
import type { HttpContext } from "@adonisjs/core/http";
import { createEventLimitedValidator, updateEventValidator } from "#validators/event";

export default class EventController {

  public async index({ request }: HttpContext ) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));

    return await Event.query().preload("participants").paginate(page, perPage);
  }

  public async show({ params }: HttpContext) {
    const eventId = Number(params.id);
    return await Event.query().preload("participants").where("id", eventId).firstOrFail();
  }

  public async findEventsByOrganizerId({ request, auth }: HttpContext) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));

    const organizerId = auth.user!.id;
    // Wszystkie poza description
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

  public async findEventById ({ request, response, bouncer }: HttpContext) {
    const eventId = Number(request.input("eventId"));
    const event = await Event.findOrFail(eventId);

    await bouncer.authorize('read_event', event);

    return response.json(event);
  }

  public async store ({ request, response, auth }: HttpContext) {
    const data = await createEventLimitedValidator.validate(request.all());
    const savedEvent = await Event.create({ ...data, organizerId: auth?.user?.id });

    return response.created(savedEvent);
  }

  public async update({  request, response, bouncer }: HttpContext) {
    const eventId = Number(request.input('eventId'));
    const event = await Event.findOrFail(eventId);

    await bouncer.authorize('update_event', event);

    const data = await updateEventValidator.validate(request.all());

    event.merge(data);
    const updatedEvent = await event.save();

    return response.ok(updatedEvent);
  }

  public async destroy({  request, response, bouncer }: HttpContext) {
    const eventId = Number(request.input('eventId'));
    const event = await Event.findOrFail(eventId);

    await bouncer.authorize('delete_event', event);

    await event.delete();

    return response.noContent();
  }

}
