import express from "express";
import { createComment, deleteComment, registerFavorites, deleteFavorite } from "../controllers/videoController";
import { registerSubscribe, deleteSubscribe } from "../controllers/userController";

const apiRouter = express.Router();

apiRouter.post("/users/:id([0-9a-f]{24})/subscribe", registerSubscribe);
apiRouter.get("/subscribe/:id([0-9a-f]{24})", deleteSubscribe);
apiRouter.post("/videos/:id([0-9a-f]{24})/favorites", registerFavorites);
apiRouter.get("/favorites/:id([0-9a-f]{24})", deleteFavorite);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.get("/comments/:id([0-9a-f]{24})", deleteComment);

export default apiRouter;