import { test } from "@japa/runner";

import testUtils from "@adonisjs/core/services/test_utils";

import { AdminFactory } from "#database/factories/admin_factory";
import { EventFactory } from "#database/factories/event_factory";

test.group("Events destroy", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test("it should delete event if user is authorized to", async ({
    client,
  }) => {
    const admin = await AdminFactory.create();
    const event = await EventFactory.merge({ organizerId: admin.id }).create();

    const response = await client
      .delete(`/api/v1/events/${event.id}`)
      .loginAs(admin);

    response.assertStatus(200);
  });

  test("it should fail if user is trying to delete other user's event", async ({
    client,
  }) => {
    const admin = await AdminFactory.create();
    const anotherAdmin = await AdminFactory.create();
    const event = await EventFactory.merge({
      organizerId: anotherAdmin.id,
    }).create();

    const response = await client
      .delete(`/api/v1/events/${event.id}`)
      .loginAs(admin);

    response.assertStatus(401);
  });
});
