/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/
import { Bouncer } from "@adonisjs/bouncer";
import { BouncerAbility } from "@adonisjs/bouncer/types";

import Admin from "#models/admin";
import Event from "#models/event";
import Permission from "#models/permission";

/**
 * Delete the following ability to start from
 * scratch
 */

const availablePermissions = await Permission.all();
const abilities: Record<string, BouncerAbility<Admin>> = {};
for (const availablePermission of availablePermissions) {
  abilities[`${availablePermission.action}_${availablePermission.subject}`] =
    Bouncer.ability(async (admin: Admin, event: Event) => {
      if (admin.type === "superadmin") {
        return true;
      }

      if (admin.uuid === event.organizerUuid) {
        return true;
      }

      const superPermission = await Permission.one("manage", "all");

      const result = await admin
        .related("permissions")
        .query()
        .where("eventUuid", event.uuid)
        .where((query) =>
          query
            .where("permissionUuid", availablePermission.uuid)
            .orWhere("permissionUuid", superPermission ?? 0),
        )
        .first();

      return Boolean(result);
    });
}

export default abilities;
