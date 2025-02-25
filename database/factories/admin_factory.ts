import Hash from "@adonisjs/core/services/hash";
import Factory from "@adonisjs/lucid/factories";

import Admin from "#models/admin";

export const AdminFactory = Factory.define(Admin, async ({ faker }) => ({
  email: faker.internet.email(),
  password: await Hash.make("SuperSecret123"),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  type: faker.helpers.arrayElement(["organizer", "superadmin"]),
})).build();
