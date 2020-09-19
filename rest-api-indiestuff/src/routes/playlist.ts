import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import PlaylistController from "../controllers/PlaylistController";

const router = Router();

router.post("/create", checkJwt, PlaylistController.createPlaylist);
router.post("/add", checkJwt, PlaylistController.addTrackToPlaylist);
router.get("/", checkJwt, PlaylistController.getPlaylists);
router.post("/get", checkJwt, PlaylistController.getPlaylist);

export default router;