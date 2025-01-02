/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from "@adonisjs/core/services/router";

const BlocksController = () => import("#controllers/blocks_controller");

router.get("/", async () => {
  return {
    hello: "world",
  };
});

router.resource("blocks", BlocksController);
