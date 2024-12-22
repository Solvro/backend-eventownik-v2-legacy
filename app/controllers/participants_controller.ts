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
  async show({ params, response }: HttpContext) {
    try {
      const participant = await Participant.find(params.id)
      if (!participant) {
        return response.status(404).send({message: `Participant with ID ${params.id} was not found`})
      }
      return response.status(200).send(participant)
    } catch (error) {
      console.error(error)
      return response.status(500).send({message: 'Internal server error'})
  }
}

  /**
   * Edit individual record
   */
  async edit({ params, request, response }: HttpContext) {
    try {
      const participant = await Participant.find(params.id)
      if (!participant) {
        return response.status(404).send({message: `Participant with ID ${params.id} was not found`})
      }
      const data = request.only(['email', 'eventId', 'firstName', 'lastName'])
      participant.merge(data)
      await participant.save()
      return response.status(200).send(participant)
    }
    catch (error) {
      console.error(error)
      return response.status(500).send({message: 'Internal server error'})
    }

  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const participant = await Participant.find(params.id)
      if (!participant) {
        return response.status(404).send({message: `Participant with ID ${params.id} was not found`})
      }
      await participant.delete()
      return response.status(200).send({message: `Participant with ID ${params.id} was deleted`})
    } catch (error) {
      console.error(error)
      return response.status(500).send({message: 'Internal server error'})
    }
  }
}