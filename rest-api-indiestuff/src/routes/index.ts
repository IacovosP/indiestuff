import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import upload from "./upload";
import album from "./album";
import search from "./search";
import artist from "./artist";
import playlist from "./playlist";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/upload", upload);
routes.use("/album", album);
routes.use("/search", search);
routes.use("/artist", artist);
routes.use("/playlist", playlist);

export default routes;
