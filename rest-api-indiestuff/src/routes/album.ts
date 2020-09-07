import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AlbumController from "../controllers/AlbumController";

const router = Router();

router.post("/create", checkJwt, AlbumController.createAlbum);
router.get("/:albumId", AlbumController.getAlbum)

export default router;