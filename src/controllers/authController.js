import User from "../models/User";
import fetch from "node-fetch";

export const startGithubLogin = (req, res) => {
    const baseUrl = "http://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailObj = emailData.find(email => email.primary === true && email.verified === true);
        if(!emailObj){
            res.render("social-login", { errorMessage: "Can't access your email information." });
        }
        let user = await User.findOne({ email: emailObj.email });
        if(!user){
            user = await User.create({
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
            });
        }
            req.session.loggedIn = true;
            req.session.user = user;
            req.flash("info", "Welcome!");
            return res.redirect("/");
        } else {
        return res.redirect("/auth/social_login");
    } 
}

export const startKakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: process.env.KAKAO_CLIENT,
        redirect_uri: "http://localhost:4500/auth/kakao/finish",
        response_type: "code",
        scope: "profile_nickname profile_image account_email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const finishKakaoLogin = async(req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
        client_id: process.env.KAKAO_CLIENT,
        client_secret: process.env.KAKAO_SECRET,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:4500/auth/kakao/finish",
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        })
    ).json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://kapi.kakao.com";
        const userData = await (await fetch(`${apiUrl}/v2/user/me`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })).json();
        const USER_KEY = userData.kakao_account;
        if(USER_KEY.is_email_valid === false || USER_KEY.is_email_verified === false) {
            res.render("social-login", { errorMessage: "Can't access your email information." });
        }
        let user = await User.findOne({ email: USER_KEY.email });
        if(!user){
            user = await User.create({
                avatarUrl: USER_KEY.profile.profile_image_url,
                username: USER_KEY.profile.nickname,
                email: USER_KEY.email,
                password: "",
                socialOnly: true,
            });
        }
            req.session.loggedIn = true;
            req.session.user = user;
            req.flash("info", "Welcome!");
            return res.redirect("/");
    } else {
        return res.redirect("/auth/social_login");
    }
}
export const startGoogleLogin = (req, res) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const config = {
        client_id: process.env.GG_CLIENT,
        redirect_uri: "http://localhost:4500/auth/google/finish",
        response_type: "code",
        include_granted_scopes: true,
        scope: ["https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"].join(" "),
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const finishGoogleLogin = async(req, res) => {
    const baseUrl = "https://oauth2.googleapis.com/token";
    const config = {
        client_id: process.env.GG_CLIENT,
        client_secret: process.env.GG_SECRET,
        redirect_uri: "http://localhost:4500/auth/google/finish",
        include_granted_scopes: true,
        grant_type: "authorization_code",
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            }
        })
    ).json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://www.googleapis.com"
        const userData = await (await fetch(`${apiUrl}/oauth2/v1/userinfo`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })).json();
        if(userData.verified_email === false) {
            res.render("social-login", { errorMessage: "Can't access your email information." });
            res.redirect("/login");
        }
        let user = await User.findOne({ email: userData.email });
        if(!user){
            user = await User.create({
                avatarUrl: userData.picture,
                username: userData.name,
                email: userData.email,
                password: "",
                socialOnly: true,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash("info", "Welcome!");
        return res.redirect("/");
    } else {
        return res.redirect("/auth/social_login");
    }
}