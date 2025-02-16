import Admin from "#models/admin";
import { AdminService } from "#services/admin_service";
import {
  createAdminValidator,
  updateAdminValidator,
} from "#validators/admin_validators";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class AdminsController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private adminService: AdminService) {}

  /**
   * Display a list of resource
   */
  async index() {
    return await Admin.query().preload("events").preload("permissions");
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const newAdminData = await createAdminValidator.validate(request.body());

    const newAdmin = await this.adminService.createAdmin(newAdminData);

    return response
      .header("Location", `/api/v1/admins/${newAdmin.id}`)
      .created();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Admin.query()
      .where("id", +params.id)
      .preload("events")
      .preload("permissions")
      .first();
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const adminUpdates = await updateAdminValidator.validate(request.body());

    const admin = await Admin.findOrFail(params.id);

    if (adminUpdates === undefined) {
      return admin;
    }

    const updatedAdmin = await this.adminService.updateAdmin(
      +params.id,
      adminUpdates,
    );

    return updatedAdmin;
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.adminService.deleteAdmin(+params.id);
    return response.noContent();
  }
}
