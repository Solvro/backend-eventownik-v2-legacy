import { test } from "@japa/runner";

import testUtils from "@adonisjs/core/services/test_utils";

import { AdminFactory } from "#database/factories/admin_factory";
import { EventFactory } from "#database/factories/event_factory";
import Event from "#models/event";

test.group("Events update", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test("it should update event if user is authorized", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();
    const event = await EventFactory.merge({ organizerId: admin.id }).create();

    const updatedData = {
      name: "Updated Event",
      description: "Updated Description",
    };

    const response = await client
      .put(`/api/v1/events/${event.id}`)
      .json(updatedData)
      .loginAs(admin);

    response.assertStatus(200);
    response.assertBodyContains({ message: "Event updated successfully" });

    const updatedEvent = await Event.findOrFail(event.id);
    assert.equal(updatedEvent.name, updatedData.name);
    assert.equal(updatedEvent.description, updatedData.description);
  });

  test("it should fail when trying to update protected fields", async ({
    client,
    assert,
  }) => {
    const admin = await AdminFactory.create();
    const event = await EventFactory.merge({ organizerId: admin.id }).create();

    const originalOrganizerId = event.organizerId;
    const originalSlug = event.slug;

    const updatedData = {
      organizerId: 999,
      slug: "new-slug",
    };

    const response = await client
      .put(`/api/v1/events/${event.id}`)
      .json(updatedData)
      .loginAs(admin);

    response.assertStatus(200);

    const updatedEvent = await Event.findOrFail(event.id);
    assert.equal(updatedEvent.organizerId, originalOrganizerId);
    assert.equal(updatedEvent.slug, originalSlug);
  });

  test("it should fail when trying to update another user's event", async ({
    client,
  }) => {
    const admin = await AdminFactory.create();

    const anotherAdmin = await AdminFactory.create();
    const event = await EventFactory.merge({
      organizerId: anotherAdmin.id,
    }).create();

    const updatedData = {
      name: "Updated Event",
      description: "Updated Description",
    };

    const response = await client
      .put(`/api/v1/events/${event.id}`)
      .json(updatedData)
      .loginAs(admin);

    response.assertStatus(401);
  });

  test("it should fail when event does not exist", async ({ client }) => {
    const admin = await AdminFactory.create();

    const response = await client
      .put("/api/v1/events/999")
      .json({ name: "Updated Event" })
      .loginAs(admin);

    response.assertStatus(404);
  });
});
