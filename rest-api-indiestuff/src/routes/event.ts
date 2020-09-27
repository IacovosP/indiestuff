import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import EventController from "../controllers/EventController";

const router = Router();

router.post("/add", checkJwt, EventController.addToRecentlyPlayed);
router.get("/", checkJwt, EventController.getRecentlyPlayed);

export default router;