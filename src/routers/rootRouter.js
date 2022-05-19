import express from "express";

/**Set Controllers */
import { getHome, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.route("/").get(getHome);
rootRouter.get("/search", search);

export default rootRouter