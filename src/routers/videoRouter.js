import express from "express";
import { videoUpload, protectMiddleware } from "../middleware";
import { getVideoUpload, postVideoUpload, Watch, getEdit, postEdit, deleteVideo } from "../controllers/videoController";
const cors = require('cors');

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", Watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectMiddleware).get(getEdit).post(videoUpload.fields([
    { name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }, { name: "captions", maxCount: 1 },
]), postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectMiddleware).get(getVideoUpload).post(videoUpload.fields([
    { name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }, { name: "captions", maxCount: 1 },
]), postVideoUpload);

export default videoRouter;