/*
import { test } from '@japa/runner'
import Admin from "#models/admin";
import Event from "#models/event";
import { DateTime } from "luxon";
import testUtils from "@adonisjs/core/services/test_utils";

test.group('Events update', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should update with valid credentials ', async ({ client, assert }) => {
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

    const token = loginResponse.body<{token: string}>().token

    const updatedEvent = {
      eventId : event.id,
      name: 'Updated Event',
      description: 'Updated Description',
    }

    const response = await client.put(`/api/v1/events/update`)
      .header('Authorization', `Bearer ${token}`)
      .json(updatedEvent)

    response.assertStatus(200)
  })

  test('it should fail to update  a slug and/or organizer id', async ({ client, assert }) => {
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
      eventId : event.id,
      organizerId: 1,
      Slug: 'test',
    }

    const response = await client.put(`/api/v1/events/update`)
      .header('Authorization', `Bearer ${token}`)
      .json(body)

    const updatedEvent = await Event.find(event.id)

    response.assertStatus(200)
    assert.equal(event.organizerId, updatedEvent.organizerId);
    assert.equal(event.slug, updatedEvent.slug);
  })

  test('it should fail while trying to update some one elses event ', async ({ client }) => {
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

    const updatedEvent = {
      eventId : event.id,
      name: 'Updated Event',
      description: 'Updated Description',
    }

    const response = await client.put(`/api/v1/events/update`)
      .header('Authorization', `Bearer ${token}`)
      .json(updatedEvent)

    response.assertStatus(403)
  })
})
*/
