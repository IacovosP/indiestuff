import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import PlaylistController from "../controllers/PlaylistController";

const router = Router();

router.post("/create", checkJwt, PlaylistController.createPlaylist);
router.post("/add", checkJwt, PlaylistController.addTrackToPlaylist);
router.post("/remove", checkJwt, PlaylistController.removeTrackFromPlaylist);
router.get("/list", checkJwt, PlaylistController.getPlaylists);
router.get("/:playlistId", PlaylistController.getPlaylist);

export default router;