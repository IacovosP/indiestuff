import { Router } from "express";
import UploadController from "../controllers/UploadController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/track", [], UploadController.track);

export default router;