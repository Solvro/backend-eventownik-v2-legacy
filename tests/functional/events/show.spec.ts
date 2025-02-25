import { test } from "@japa/runner";

import testUtils from "@adonisjs/core/services/test_utils";

import { AdminFactory } from "#database/factories/admin_factory";
import { EventFactory } from "#database/factories/event_factory";
import type Event from "#models/event";

test.group("Events show", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test("it should return event by id", async ({ client, assert }) => {
    const admin = await AdminFactory.create();
    const event = await EventFactory.merge({ organizerId: admin.id }).create();

    const response = await client
      .get(`/api/v1/events/${event.id}`)
      .loginAs(admin);

    response.assertStatus(200);

    const responseBody = response.body() as Event;
    assert.equal(responseBody.id, event.id);
    assert.equal(responseBody.name, event.name);
    assert.equal(responseBody.organizerId, event.organizerId);
  });

  test("it should fail with 404 for non-existent event", async ({ client }) => {
    const admin = await AdminFactory.create();
    const nonExistentId = 99999;

    const response = await client
      .get(`/api/v1/events/${nonExistentId}`)
      .loginAs(admin);

    response.assertStatus(404);
  });
});
