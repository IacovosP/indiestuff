import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import PlaylistController from "../controllers/PlaylistController";

const router = Router();

router.post("/create", checkJwt, PlaylistController.createPlaylist);
router.get("/", checkJwt, PlaylistController.getPlaylists)

export default router;