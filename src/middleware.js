import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
});
const s3ImageUploader = multerS3({
    s3: s3,
    bucket: "bibley/images",
    acl: "public-read",
});
const s3VideoUploader = multerS3({
    s3: s3,
    bucket: "bibley/videos",
    acl: "public-read",
});

const isHeroku = process.env.NODE_ENV === "production";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.isHeroku = isHeroku;
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
}, storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({ dest:"uploads/videos/", limits: {
    fileSize: 2147483648,
}, storage: isHeroku ? s3VideoUploader : undefined,
});
