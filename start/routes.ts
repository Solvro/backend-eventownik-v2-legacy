/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from "@adonisjs/core/services/router";
const EventController  = () => import ("../app/controllers/event_contoller.js");

router.group(() => {
  router.get("/", [EventController, "index"]);
  router.post("/", [EventController, "store"]);
  router.get("/:id", [EventController, "show"]);
  router.put("/:id",  [EventController, "update"]);
  router.delete("/:id", [EventController, "destroy"]);
}).prefix("api/v1/events");


router.get("/", async () => {
  return {
    hello: "world",
  };
});
