/*
import { test } from '@japa/runner'
import testUtils from "@adonisjs/core/services/test_utils";
import Admin from "#models/admin";
import Event from "#models/event";
import { DateTime } from "luxon";


test.group('Events destroy', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should delete event if user is authorized to', async ({ client, assert }) => {
    const admin = await Admin.create({
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
      firstName: 'Valid',
      lastName: 'User',
      type: 'organizer',
    })

    const event = await Event.create({
      name: 'Event',
      description: 'Description',
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      organizerId: admin.id,
    })

    const payload = {
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
    }

    const loginResponse = await client.post('/api/v1/auth/login').json(payload)

    const token = loginResponse.body().token

    const body = {
      eventId: event.id,
    }

    const response = await client.delete('/api/v1/events/delete')
      .header('Authorization', `Bearer ${token}`)
      .json(body)
    response.assertStatus(204)
  })

  test("it should fail if user is trying to delete other user's event", async ({ client, assert }) => {
    const admin = await Admin.create({
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
      firstName: 'Valid',
      lastName: 'User',
      type: 'organizer',
    })

    const admin2 = await Admin.create({
      email: 'valid-user2@example.com',
      password: 'SuperSecret123',
      firstName: 'Valid',
      lastName: 'User',
      type: 'organizer',
    })

    const event = await Event.create({
      name: 'Event',
      description: 'Description',
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      organizerId: admin2.id,
    })

    const payload = {
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
    }

    const loginResponse = await client.post('/api/v1/auth/login').json(payload)

    const token = loginResponse.body().token

    const body = {
      eventId: event.id,
    }

    const response = await client.delete('/api/v1/events/delete')
      .header('Authorization', `Bearer ${token}`)
      .json(body)
    response.assertStatus(403)
  })
})
*/
