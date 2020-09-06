import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import upload from "./upload";
import album from "./album";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/upload", upload);
routes.use("/album", album);
export default routes;
