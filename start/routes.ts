/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from "@adonisjs/core/services/router";
const EventController  = () => import ("#controllers/events_controller");

router.resource("events", EventController);


router.get("/", async () => {
  return {
    hello: "world",
  };
});
