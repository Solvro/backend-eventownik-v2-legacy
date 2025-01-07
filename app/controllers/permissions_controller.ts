import Permission from "#models/permission";
import {
  createPermissionValidator,
  updatePermissionValidator,
} from "#validators/permission_validators";
import type { HttpContext } from "@adonisjs/core/http";

export default class PermissionsController {
  /**
   * Display a list of resource
   */
  async index() {
    return await Permission.all();
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const newPermissionData = await createPermissionValidator.validate(
      request.body(),
    );

    const newPermission = await Permission.create({ ...newPermissionData });

    return response
      .header("Location", `/api/v1/permissions/${newPermission.id}`)
      .created();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return Permission.findOrFail(params.id);
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const permissionUpdates = await updatePermissionValidator.validate(
      request.body(),
    );

    const permission = await Permission.findOrFail(params.id);
    permission.merge(permissionUpdates);

    return await permission.save();
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const permissionToDelete = await Permission.findOrFail(params.id);
    await permissionToDelete.delete();
    return response.noContent();
  }
}
