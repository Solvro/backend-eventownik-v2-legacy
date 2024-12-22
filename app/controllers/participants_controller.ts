import { HttpContext } from '@adonisjs/core/http'
import Participant from '#models/participant'
import { http } from '#config/app'


export default class ParticipantsController {
  /**
   * Display a list of resource
   */

  async index({response}: HttpContext) {
    try{
      const participants = await Participant.all()
      if (!participants) {
        return response.status(404).send({message: 'No participants found'})
      }
      return response.status(200).send(participants)
    } catch (error) {
      console.error(error)
      return response.status(500).send({message: 'Internal server error'})
  }
}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}