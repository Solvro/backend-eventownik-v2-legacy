import Event from "#models/event";
import type { HttpContext } from "@adonisjs/core/http";
import { createEventLimitedValidator, createEventValidator, updateEventValidator } from "#validators/event";

export default class EventController {

  public async index({ request }: HttpContext ) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));

    return await Event.query().preload("participants").paginate(page, perPage);
  }

  public async store({ request, response }: HttpContext) {
    const data = await createEventValidator.validate(request.all());
    await Event.create(data);
    return response.created();
  }

  public async show({ params }: HttpContext) {
    const eventId = Number(params.id);
    return await Event.query().preload("participants").where("id", eventId).firstOrFail();

  }

  public async update({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id);
    const data = await updateEventValidator.validate(request.all());
    event.merge(data);
    await event.save();
    return response.ok({ message: "Event updated successfully" });
  }

  public async destroy({ response,params }: HttpContext) {
    const event = await Event.findOrFail(params.id);
    await event.delete();
    return response.noContent();
  }

  public async createEvent({ request, response }: HttpContext) {
    const data = await createEventLimitedValidator.validate([request.all()]);
    await Event.create(data);

    return response.created();
  }

  public async findEventsByOrganizerId({ request }: HttpContext) {
    const page = Number(request.input("page", 1));
    const perPage = Number(request.input("perPage", 10));
    const organizerId = Number(request.input("organizerId"));
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

  public async findEventById ({ request, response }: HttpContext) {
    const eventId = Number(request.input("eventId"));
    const organizerId = Number(request.input("organizerId"));
    const event = await Event.findOrFail(eventId);


    return response.json(event);
  }

  public async editEvent({  request, response, auth }: HttpContext) {
    const eventId = Number(request.input('organizerId'));
    const organizerId = Number(request.input('eventId'));
    const event = await Event.findOrFail(eventId);


    const data = await updateEventValidator.validate(request.all());

    event.merge(data);
    await event.save();

    return response.ok({ message: 'Event updated successfully' });
  }

  public async deleteEvent({  request, response }: HttpContext) {
    const eventId = Number(request.input('organizerId'));
    const organizerId = Number(request.input('eventId'));
    const event = await Event.findOrFail(eventId);


    await event.delete();

    return response.noContent();
  }

}
