import express from "express";

import { getAuth, getEmailJoin, postEmailJoin, getEmailLogin, postEmailLogin, getSocialLogin } from "../controllers/userController";
import { startGithubLogin, finishGithubLogin, startKakaoLogin, finishKakaoLogin, startGoogleLogin, finishGoogleLogin } from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/", getAuth);
authRouter.route("/email_join").get(getEmailJoin).post(postEmailJoin);
authRouter.route("/email_login").get(getEmailLogin).post(postEmailLogin);
authRouter.get("/social_login", getSocialLogin);

authRouter.get("/github/start", startGithubLogin);
authRouter.get("/github/finish", finishGithubLogin);
authRouter.get("/kakao/start", startKakaoLogin);
authRouter.get("/kakao/finish", finishKakaoLogin);
authRouter.get("/google/start", startGoogleLogin);
authRouter.get("/google/finish", finishGoogleLogin);


export default authRouter;

