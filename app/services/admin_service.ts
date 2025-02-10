import Admin from "#models/admin";
import { AdminCreateDTO } from "#validators/admin_validators";

export class AdminService {
  async createAdmin(newAdminData: AdminCreateDTO) {
    const newAdmin = await Admin.create(newAdminData);

    newAdminData.permissions?.forEach(async (adminPermission) => {
      await newAdmin.related("permissions").attach({
        [adminPermission.permissionId]: { event_id: adminPermission.eventId },
      });
    });

    return newAdmin;
  }
}
