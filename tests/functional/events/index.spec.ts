import { test } from "@japa/runner";

import testUtils from "@adonisjs/core/services/test_utils";

import { AdminFactory } from "#database/factories/admin_factory";
import { EventFactory } from "#database/factories/event_factory";
import type Admin from "#models/admin";
import type Event from "#models/event";

interface AdminWithEvents extends Admin {
  events: Event[];
}

test.group("Events index", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test("it should return events for authenticated admin", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();

    // Create multiple events for this admin
    const adminEvents = await EventFactory.merge([
      { organizerId: admin.id },
      { organizerId: admin.id },
      { organizerId: admin.id },
    ]).createMany(3);

    const response = await client.get("/api/v1/events").loginAs(admin);

    response.assertStatus(200);

    // Since the controller returns the user with preloaded events
    const responseBody = response.body() as AdminWithEvents;
    assert.lengthOf(responseBody.events, 3);

    // Verify all returned events belong to the admin
    responseBody.events.forEach((event) => {
      assert.equal(event.organizerId, admin.id);
    });

    // Verify the returned events match our created events
    const eventIds = responseBody.events.map((event) => event.id);
    adminEvents.forEach((event) => {
      assert.include(eventIds, event.id);
    });
  });

  test("it should return empty array when admin has no events", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();

    const response = await client.get("/api/v1/events").loginAs(admin);

    response.assertStatus(200);
    const responseBody = response.body() as AdminWithEvents;
    assert.isArray(responseBody.events);
    assert.isEmpty(responseBody.events);
  });

  test("it should not return events from other admins", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();
    const otherAdmin = await AdminFactory.create();

    // Create events for both admins
    await EventFactory.merge([
      { organizerId: admin.id },
      { organizerId: admin.id },
    ]).createMany(2);

    await EventFactory.merge([
      { organizerId: otherAdmin.id },
      { organizerId: otherAdmin.id },
    ]).createMany(2);

    const response = await client.get("/api/v1/events").loginAs(admin);

    response.assertStatus(200);

    const responseBody = response.body() as AdminWithEvents;
    assert.lengthOf(responseBody.events, 2);

    // Verify only the authenticated admin's events are returned
    responseBody.events.forEach((event) => {
      assert.equal(event.organizerId, admin.id);
    });
  });

  test("it should fail if user is not authenticated", async ({ client }) => {
    const response = await client.get("/api/v1/events");
    response.assertStatus(401);
  });
});
