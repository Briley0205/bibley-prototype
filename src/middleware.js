import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
}
export const protectMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Please log in first");
        return res.redirect("/auth");
    }
}
export const avatarUpload = multer({ dest:"uploads/avatars/", limits: {
    fileSize: 3000000,
} });
export const videoUpload = multer({ dest:"uploads/videos/", limits: {
    fileSize: 2147483648,
} });
