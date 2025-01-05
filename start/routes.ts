import router from "@adonisjs/core/services/router";

import { middleware } from "./kernel.js";

const ParticipantsController = () =>
  import("#controllers/participants_controller");
const AuthController = () => import("#controllers/auth_controller");

router
  .group(() => {
    router.resource("participants", ParticipantsController);

    router
      .group(() => {
        router.post("login", [AuthController, "login"]);
        router.post("register", [AuthController, "register"]);
        router.get("me", [AuthController, "me"]).use(middleware.auth());
      })
      .prefix("auth");
  })
  .prefix("api/v1");
