/*
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Admin from "#models/admin";

test.group('Events store', (group) => {
  // Begin a DB transaction before each test and roll it back after
  group.each.setup(() => testUtils.db().withGlobalTransaction())


  test('it should store the event with valid data', async ({ client, assert }) => {

    const admin = await Admin.create({
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
      firstName: 'Valid',
      lastName: 'User',
      type: 'organizer',
    })

    const payload = {
      email: 'valid-user@example.com',
      password: 'SuperSecret123',
    }

    const loginResponse = await client.post('/api/v1/auth/login').json(payload)

    const event = {
      name: "aaaa",
      startDate: "2025-03-05 12:00:00",
      endDate: "2025-03-05 12:00:00"
    }

    const token = loginResponse.body().token

    const response = await client.post('/api/v1/events/create')
      .header('Authorization', `Bearer ${token}`)
      .json(event)

    response.assertStatus(201)
  })


  test('it shoud not store the event if no user is logged in', async ({ client, assert }) => {
    const event = {
      name: "aaaa",
      startDate: "2025-03-05 12:00:00",
      endDate: "2025-03-05 12:00:00"
    }

    const response = await client.post('/api/v1/events/create')
      .json(event)

    response.assertStatus(401)
  })
})
*/
