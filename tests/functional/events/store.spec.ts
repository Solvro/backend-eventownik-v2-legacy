import { test } from "@japa/runner";

import testUtils from "@adonisjs/core/services/test_utils";

import { AdminFactory } from "#database/factories/admin_factory";
import Event from "#models/event";
import Permission from "#models/permission";

test.group("Events store", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test("it should store the event with valid data", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();

    const eventData = {
      name: "Test Event",
      startDate: "2025-03-05 12:00:00",
      endDate: "2025-03-05 12:00:00",
      //slug:"test"
    };
    const response = await client
      .post("/api/v1/events")
      .json(eventData)
      .loginAs(admin);

    response.assertStatus(201);

    // Verify event was created
    const event = await Event.findBy("name", eventData.name);
    assert.exists(event);
    assert.equal(event?.organizerId, admin.id);

    // Verify permissions were attached
    const permission = await Permission.query()
      .where("action", "manage")
      .where("subject", "all")
      .first();

    const userPermissions = await admin.related("permissions").query();
    assert.isTrue(
      userPermissions.some(
        (p) =>
          p.id === permission?.id && p.$extras.pivot_event_id === event?.id,
      ),
    );
  });

  test("it should fail to store event with invalid data", async ({
    client,
  }) => {
    const admin = await AdminFactory.create();

    const invalidEventData = {
      name: "Test Event",
      // Missing required dates
    };

    const response = await client
      .post("/api/v1/events")
      .json(invalidEventData)
      .loginAs(admin);

    response.assertStatus(422);
  });

  test("it should not store event if user is not authenticated", async ({
    client,
  }) => {
    const eventData = {
      name: "Test Event",
      startDate: "2025-03-05 12:00:00",
      endDate: "2025-03-05 12:00:00",
    };

    const response = await client.post("/api/v1/events").json(eventData);

    response.assertStatus(401);
  });

  test("it should validate date format", async ({ client }) => {
    const admin = await AdminFactory.create();

    const invalidDateFormat = {
      name: "Test Event",
      startDate: "2025-03-05", // Invalid format
      endDate: "2025-03-05", // Invalid format
    };

    const response = await client
      .post("/api/v1/events")
      .json(invalidDateFormat)
      .loginAs(admin);

    response.assertStatus(422);
  });
});
