import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import TrackController from "../controllers/TrackController";

const router = Router();

router.delete("/:trackId", checkJwt, TrackController.deleteTrack);

export default router;