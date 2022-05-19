import express from "express";
import { protectMiddleware, avatarUpload } from "../middleware";
import { logout, getEdit, postEdit, seeProfile, getChangePassword, postChangePassword } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})", seeProfile);
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectMiddleware).get(getChangePassword).post(postChangePassword);

export default userRouter;