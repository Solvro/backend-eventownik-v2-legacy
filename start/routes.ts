/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from "@adonisjs/core/services/router";
import("#controllers/participants_controller");
import ParticipantsController from "#controllers/participants_controller";
const participants = new ParticipantsController();
router.get("/", async () => {
  return {
    hello: "world",
  };
});

router.get("/api/v1/participants",participants.index);
router.get("/api/v1/participants/:id",participants.show);

router.post("/api/v1/participants",participants.store);
router.patch("/api/v1/participants/:id",participants.edit);

router.delete("/api/v1/participants/:id",participants.destroy);