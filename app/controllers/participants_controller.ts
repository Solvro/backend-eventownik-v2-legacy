import { HttpContext } from '@adonisjs/core/http'
import Participant from '#models/participant'

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

  async store({ request, response }: HttpContext) {
    // Walidacja danych, do wrzucenia jako middleware
    if (request.input('email') == null || request.input('eventId') == null || request.input('firstName') == null || request.input('lastName') == null) {
      console.log('Invalid request')
      return response.status(400).send({message: 'Invalid request'})
    }  
    // Zapisanie danych do bazy
    try {
      const data = request.only(['email', 'eventId', 'firstName', 'lastName'])
      const participant = await Participant.create(data)
      return response.status(201).send(participant)
    // Błąd niewynikający z błędu użytkownika
    }catch (error) {
      console.error(error)
      return response.status(500).send({message: 'Internal server error'})
  }

  }

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
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}