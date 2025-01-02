import { HttpContext } from '@adonisjs/core/http'
import Participant from '#models/participant'
import { participantsStoreValidator, participantsUpdateValidator } from '#validators/participants'

export default class ParticipantsController {
  /**
   * Display a list of resource
   */

  async index({response}: HttpContext) {
      const participants = await Participant.all();
      if (!participants) {
        return response.status(404).send([]);
      }
      return participants;
}

  /**
   * Handle form submission for the create action
   */

  async store({ request, response }: HttpContext) {
    const data = await participantsStoreValidator.validate(request.all());
    const participant = await Participant.create(data);
    return response.status(201).send(participant);
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
      return await Participant.findOrFail(params.id);
}

  /**
   * Edit individual record
   */
  async update({ params, request }: HttpContext) {
    const data = await participantsUpdateValidator.validate(request.all());
    const participant = await Participant.findOrFail(params.id);
    participant.merge(data);
    await participant.save();
    return {"message": `Participant successfully updated.`, participant};
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const participant = await Participant.findOrFail(params.id);
    await participant.delete();
    return {"message": `Participant successfully deleted.`};
  }
}