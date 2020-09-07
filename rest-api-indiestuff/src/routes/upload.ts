import { Router } from "express";
import UploadController, { uploadTrack } from "../controllers/UploadController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/track", UploadController.track);
router.post("/image", UploadController.image);

export default router;