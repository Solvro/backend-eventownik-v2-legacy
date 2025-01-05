import Admin from "#models/admin";
import { loginValidator, registerAdminValidator } from "#validators/auth";
import type { HttpContext } from "@adonisjs/core/http";

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerAdminValidator);
    const admin = await Admin.create({ type: "organizer", ...data });
    const token = await Admin.accessTokens.create(admin);
    return {
      admin,
      token: token.value!.release(),
    };
  }

  async login({ request }: HttpContext) {
    const { email, password, rememberMe } =
      await request.validateUsing(loginValidator);

    const admin = await Admin.verifyCredentials(email, password);
    const token = await Admin.accessTokens.create(admin, [], {
      expiresIn: rememberMe ? "30 days" : "1 day",
    });

    return {
      admin,
      token: token.value!.release(),
    };
  }

  async me({ auth }: HttpContext) {
    return auth.getUserOrFail();
  }
}
