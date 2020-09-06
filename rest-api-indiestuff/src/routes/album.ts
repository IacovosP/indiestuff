import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AlbumController from "../controllers/AlbumController";

const router = Router();

router.post("/create", AlbumController.createAlbum);

export default router;