import { DateTime } from "luxon";

import Factory from "@adonisjs/lucid/factories";

import Event from "#models/event";

//import { AdminFactory } from './admin_factory.js'

export const EventFactory = Factory.define(Event, async ({ faker }) => {
  //const admin = await AdminFactory.create()
  return {
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    startDate: DateTime.now().plus({ days: 1 }),
    endDate: DateTime.now().plus({ days: 2 }),
    organizerId: null,
  };
}).build();
