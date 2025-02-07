import Admin from "#models/admin";
import {
  createAdminValidator,
  updateAdminValidator,
} from "#validators/admin_validators";
import type { HttpContext } from "@adonisjs/core/http";

export default class AdminsController {
  /**
   * Display a list of resource
   */
  async index() {
    return await Admin.all();
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const newAdminData = await createAdminValidator.validate(request.body());

    const newAdmin = await Admin.create({ ...newAdminData });

    newAdminData.permissions?.forEach(async (adminPermission) => {
      await newAdmin.related("permissions").attach({
        [adminPermission.permissionId]: { event_id: adminPermission.eventId },
      });
    });

    return response
      .header("Location", `/api/v1/admins/${newAdmin.id}`)
      .created();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return Admin.findOrFail(params.id);
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const adminUpdates = await updateAdminValidator.validate(request.body());

    const admin = await Admin.findOrFail(params.id);
    admin.merge(adminUpdates);

    return await admin.save();
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const adminToDelete = await Admin.findOrFail(params.id);
    await adminToDelete.delete();
    return response.noContent();
  }
}
