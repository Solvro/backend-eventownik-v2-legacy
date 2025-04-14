import { SolvroAuthDriverService } from "@solvro/auth";

import { defineConfig } from "@adonisjs/ally";

import env from "#start/env";

const allyConfig = defineConfig({
  solvroAuth: SolvroAuthDriverService({
    callbackUrl: `${env.get("APP_DOMAIN")}/api/v1/auth/callback`,
    clientId: env.get("SOLVRO_AUTH_CLIENT_ID"),
    clientSecret: env.get("SOLVRO_AUTH_CLIENT_SECRET"),
  }),
});

export default allyConfig;

declare module "@adonisjs/ally/types" {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
