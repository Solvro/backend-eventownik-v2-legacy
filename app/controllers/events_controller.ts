import type { HttpContext } from "@adonisjs/core/http";

import Event from "#models/event";
import { createEventValidator, updateEventValidator } from "#validators/event";

export default class EventController {
  public async index({ request }: HttpContext) {
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
    return await Event.query()
      .preload("participants")
      .where("id", eventId)
      .firstOrFail();
  }

  public async update({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id);
    const data = await updateEventValidator.validate(request.all());
    event.merge(data);
    await event.save();
    return response.ok({ message: "Event updated successfully" });
  }

  public async destroy({ response, params }: HttpContext) {
    const event = await Event.findOrFail(params.id);
    await event.delete();
    return response.noContent();
  }
}
