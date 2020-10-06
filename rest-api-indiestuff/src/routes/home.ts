import { Router } from "express";
import HomePageController from "../controllers/HomePageController";

const router = Router();

router.get("/", HomePageController.getHomePage)

export default router;