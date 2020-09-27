import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import LikesController from "../controllers/LikesController";

const router = Router();

router.post("/add", checkJwt, LikesController.addTrackToLikedPlaylist);
router.get("/ids", checkJwt, LikesController.getLikedTracksIdsOnly);
router.get("/", checkJwt, LikesController.getLikedTracksPlaylist);

export default router;