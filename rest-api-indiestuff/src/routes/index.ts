import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import upload from "./upload";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/upload", upload);
export default routes;
