import Admin from "#models/admin";
import { createAdminValidator } from "#validators/admin_validators";
import { inject } from "@adonisjs/core";

import { AdminService } from "./admin_service.js";

@inject()
export class OrganizerService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private adminService: AdminService) {}

  async addOrganizer(
    eventId: number,
    organizerData: { email: string; permissionsIds: number[] },
  ) {
    const admin = await Admin.findBy("email", organizerData.email);

    if (admin) {
      organizerData.permissionsIds.forEach(async (permissionId) => {
        await admin
          .related("permissions")
          .attach({ [permissionId]: { event_id: eventId } });
      });
    } else {
      const newAdminData = await createAdminValidator.validate(organizerData);

      await this.adminService.createAdmin(newAdminData);
    }
  }
}
