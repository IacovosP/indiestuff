import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import CommentController from "../controllers/CommentController";

const router = Router();

router.post("/add", checkJwt, CommentController.addComment);
router.get("/:commentThreadId", CommentController.getCommentThread);
router.get("/track/:trackId", CommentController.getTrackCommentThread);

export default router;