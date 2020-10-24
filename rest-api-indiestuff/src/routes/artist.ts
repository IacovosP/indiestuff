import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import ArtistController from "../controllers/ArtistController";

const router = Router();

router.get("/single/myArtistPage", checkJwt, ArtistController.getMyArtistPage)
router.get("/:artistId", ArtistController.getArtist)

export default router;