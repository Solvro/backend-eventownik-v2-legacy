import router from "@adonisjs/core/services/router";

const ParticipantsController = () => import("#controllers/participants_controller");
router.resource("/api/v1/participants", ParticipantsController);

const emailsController = () => import("#controllers/emails_controller");
router.resource("/api/v1/emails", emailsController);
