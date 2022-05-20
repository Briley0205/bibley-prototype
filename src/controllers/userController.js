import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";

export const getAuth = (req, res) => {
    try {
        return res.render("auth", { pageTitle: "Authorize" });
    } catch(err) {
        console.log(err.message);
    }
};

export const getEmailJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
}
export const postEmailJoin = async(req, res) => {
    const { email, username, password, password2 } = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", { 
            pageTitle, 
            errorMessage: "Password confirmation does not match.", });
    };
    const exists = await User.exists({ email });
    if(exists){
        return res.status(400).render("join", { 
            pageTitle, 
            errorMessage:"This email is already taken." });
    }
    try {
        await User.create({
            username, email, password, avatarUrl: "/static/images/Logo-piyo-profile.png",
        });
        return res.redirect("/auth/email_login");
    } catch(error) {
        return res.status(400).render("join", 
        { pageTitle,  
        errorMessage: error._message});
    }
}
export const getEmailLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
}
export const postEmailLogin = async(req, res) => {
    const { email, password } = req.body;
    const pageTitle = "Login";
    const userExists = await User.findOne({email, socialOnly: false });
    if(!userExists){
        return res.status(400).render("login", 
        {pageTitle, 
        errorMessage: "An account with this email does not exists."});
    }
    const passwordOk = await bcrypt.compare(password, userExists.password);
    if(!passwordOk){
        return res.status(400).render("login", 
        {pageTitle, 
        errorMessage: "Wrong password.",});
    }
    req.session.loggedIn = true;
    req.session.user = userExists;
    req.flash("info", "Welcome!");
    return res.redirect("/");
}

export const getSocialLogin = (req, res) => {
    return res.render("social-login", { pageTitle: "Social Login" })
}
export const logout = (req, res) => {
    req.session.user = null;
    res.locals.loggedInUser = req.session.user;
    req.session.loggedIn = false;
    req.flash("info", "Bye bye");
    return res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
}
export const postEdit = async(req, res) => {
    const {
        session: {
            user: { _id, avatarUrl },
        },
        body: { email, username },
        file,
    } = req;
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? `${file.location}` :avatarUrl,
        email, 
        username,
    },
    { new: true }
    );
    req.session.user = updatedUser;
    req.flash("info", "Information updated");
    return res.redirect("/users/edit");
}
export const seeProfile = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos").populate("comments");
    if(!user) {
        req.flash("error", "Missing user info");
        return res.status(404).render("404", { pageTitle: "User not found" });
    }
    return res.render("profile", { pageTitle: `${user.username}`, user });
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        req.flash("info", "You don't need to change a password");
        return res.redirect("/");
    }
    return res.render("change-password", { pageTitle: "Change Password" });
}
export const postChangePassword = async(req, res) => {
    const {
        session: {
            user: { _id, password },
        },
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    const oldPasswordOK = await bcrypt.compare(oldPassword, password);
    if(!oldPasswordOK) {
        req.flash("error", "The old password is incorrect");
        return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "The old password is incorrect" });
    }
    if(oldPassword === newPassword) {
        req.flash("error", "You have already used this password before");
        return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "You have already used this password before." });
    }
    if(newPassword !== newPassword1) {
        req.flash("error", "The new password does not match the confirmation");
        return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "The new password does not match the confirmation" });
    }
    const user = await User.findById(_id)
    user.password = newPassword
    await user.save();
    req.session.user.password = user.password
    req.flash("info", "Password have been changed successfully.");
    return res.redirect("/users/logout");
}
export const registerSubscribe = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    const ownerId = video.owner._id;
    const owner = await User.findById(ownerId);
    if(!owner) {
        req.flash("error", "You're not the owner");
        res.status(404);
    }
    owner.meta.subscribe = owner.meta.subscribe + 1;
    await owner.save();
    return res.status(200).json();
}
export const deleteSubscribe = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    const ownerId = video.owner._id;
    const owner = await User.findById(ownerId);
    if(!owner) {
        req.flash("error", "You're not the owner");
        res.status(404);
    }
    owner.meta.subscribe = owner.meta.subscribe - 1;
    await owner.save();
    return res.status(200).json();
}