import swagger from "#config/swagger";
import router from "@adonisjs/core/services/router";
import AutoSwagger from "adonis-autoswagger";
import { middleware } from "./kernel.js";


const BlocksController = () => import("#controllers/blocks_controller");
const EventController  = () => import ("#controllers/events_controller");
const ParticipantsController = () => import("#controllers/participants_controller");
const AuthController = () => import("#controllers/auth_controller");
const PermissionsController = () => import("#controllers/permissions_controller");
const AdminsController = () => import("#controllers/admins_controller");

router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});
router.get("/docs", async () => {
  return AutoSwagger.default.scalar("/swagger");
});

router
  .group(() => {
    router.resource("participants", ParticipantsController).apiOnly();
    router.resource("permissions", PermissionsController);
    router.resource("admins", AdminsController);
    router.resource("events", EventController).use("*", middleware.auth());
    router.resource("blocks", BlocksController);

    router
      .group(() => {
        router.post("create", [EventController, "store"]);
        router.get("details", [EventController, "findEventById"]);
        router.put("update", [EventController, "update"]);
        router.delete("delete", [EventController, "destroy"]);
      }).prefix("events").use(middleware.auth());

    router
      .group(() => {
        router.post("login", [AuthController, "login"]);
        router.post("register", [AuthController, "register"]);
        router.get("me", [AuthController, "me"]).use(middleware.auth());
      })
      .prefix("auth");
  })
  .prefix("api/v1");
