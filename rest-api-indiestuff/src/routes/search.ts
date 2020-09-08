import { Router } from "express";
import SearchController from "../controllers/SearchController";

const router = Router();

router.post("/", SearchController.find);

export default router;