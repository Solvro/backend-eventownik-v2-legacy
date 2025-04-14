import assert from "node:assert";
import crypto from "node:crypto";

import type { HttpContext } from "@adonisjs/core/http";

import Admin from "#models/admin";
import { loginValidator, registerAdminValidator } from "#validators/auth";

export default class AuthController {
  /**
   * @register
   * @operationId registerAdmin
   * @description Enables registration of admin. After registration admin is logged in and bearer token is generated.
   * @tag auth
   * @requestBody <registerAdminValidator>
   * @responseBody 200 - {"admin": "<Admin>", "token": "oat_Mw.YUxCZHV2Y0ZjNzJKcU5LejV0Q241V0JDUm83QlspsRENDZU9qT"}
   * @responseBody 422 - {"errors":[ { "message": "First name field is required", "field": "firstName" }]}
   */
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerAdminValidator);
    const admin = await Admin.create({ type: "organizer", ...data });
    const token = await Admin.accessTokens.create(admin);

    assert(token.value !== undefined, "Token value is missing");

    return {
      admin,
      token: token.value.release(),
    };
  }

  /**
   * Generate a random password string
   */
  private generateRandomPassword(length = 16): string {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  }

  /**
   * @login
   * @operationId loginAdmin
   * @description Enables login. Default method is token authorization. Support rememberMe functionality. If rememberMe is set to true then token expires in 30 days, otherwise in 24h.
   * @tag auth
   * @requestBody <loginValidator>
   * @responseBody 200 - {"admin": "<Admin>", "token": "oat_Mw.YUxCZHV2Y0ZjNzJKcU5LejV0Q241V0JDUm83QlspsRENDZU9qT"}
   * @responseBody 400 - {"errors":[ { "message": "Invalid user credentials" }]}
   * @responseBody 422 - {"errors":[ { "message": "Password field is required", "field": "password" }]}
   */
  async login({ request }: HttpContext) {
    const { email, password, rememberMe } =
      await request.validateUsing(loginValidator);

    const admin = await Admin.verifyCredentials(email, password);
    const token = await Admin.accessTokens.create(admin, [], {
      expiresIn: rememberMe === true ? "30 days" : "1 day",
    });

    assert(token.value !== undefined, "Token value is missing");

    return {
      admin,
      token: token.value.release(),
    };
  }

  async redirect(ctx: HttpContext) {
    const driver = ctx.ally.use("solvroAuth");

    return driver.getRedirectUrl();
  }

  async callback(ctx: HttpContext) {
    const driver = ctx.ally.use("solvroAuth");

    const details = await driver.user();

    assert(details.email !== null, "Invalid user profile. Email is missing");

    const user = await Admin.firstOrCreate(
      { email: details.email },
      {
        email: details.email,
        firstName: details.name,
        lastName: details.nickName,
        active: true,
        password: this.generateRandomPassword(),
      },
    );

    const accessToken = await Admin.accessTokens.create(user);

    return {
      accessToken,
    };
  }
  /**
   * @me
   * @operationId authenticatedAdmin
   * @description Returns information about logged in admin. If request not authorized returns error.
   * @tag auth
   * @responseBody 200 - <Admin>
   * @responseBody 400 - {"errors":[ { "message": "Unauthorized access" }]}
   */
  async me({ auth }: HttpContext) {
    return auth.getUserOrFail();
  }
}
