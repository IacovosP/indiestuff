import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import upload from "./upload";
import album from "./album";
import search from "./search";
import artist from "./artist";
import playlist from "./playlist";
import comment from "./comment";
import likes from "./likes";
import event from "./event";
import home from "./home";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/upload", upload);
routes.use("/album", album);
routes.use("/search", search);
routes.use("/artist", artist);
routes.use("/playlist", playlist);
routes.use("/comment", comment);
routes.use("/likes", likes);
routes.use("/event", event);
routes.use("/home", home);

export default routes;
