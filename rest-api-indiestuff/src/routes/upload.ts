import { Router } from "express";
import UploadController, { uploadTrack } from "../controllers/UploadController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/track", UploadController.track);
router.post("/image", UploadController.image);
router.post("/artistImage", checkJwt, UploadController.artistImage);

export default router;