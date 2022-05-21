import { getAnime } from "../animeInfoDB";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const getHome = async(req, res) => {
    console.log(req);
    try {
        const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner");
        return res.render("home", { pageTitle: "Home", trendingAnime: getAnime(), videos });
    } catch(err) {
        return res.render("server-error");
    }
}
export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword){
            videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "gi")
            },
        }).populate("owner");
    }
    return res.render("global-search", {pageTitle: "search", videos});
}

export const Watch = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    const asideVideo = await Video.find({}).sort({createdAt: "desc"}).populate("owner");
    if(video === null){
        return res.render("404", {pageTitle: "Video not found"});
    };
    return res.render("watch", {pageTitle: `${video.title}`, video, asideVideo});
}
export const createComment = async(req, res) => {
    const { 
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const currentUser = await User.findById(user._id);
    const video = await Video.findById(id);
    if (!video) {
        req.flash("error", "Missing video file");
        return res.sendStatus(404);
    }
    const comment = await Comment.create({ 
        text,
        ownerAvatarUrl: user.avatarUrl,
        username: user.username,
        owner: user._id,
        video: id,
        createdAt: new Date(Date.now()).toLocaleDateString(),
    });
    video.comments.push(comment._id);
    video.save();
    currentUser.comments.push(comment._id);
    currentUser.save();
    return res.status(201).json({ newCommentId: comment._id, userAvatar: user.avatarUrl, username: user.username, createdAt: new Date(Date.now()).toLocaleDateString() });
}
export const deleteComment = async (req, res) => {
    const {
      session: {
        user
      },
      params: {
        id: commentId
      }
    } = req;
    const comment = await Comment.findById(commentId).populate("video").populate("owner");
    if (!comment) {
        req.flash("error", "Missing comment");
      return res.sendStatus(404);
    }
    if (String(user._id) !== String(comment.owner._id)) {
        req.flash("error", "You're not the owner");
      return res.Status(403).redirect("/");
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).redirect(`/videos/${comment.video._id}`);
}

export const getVideoUpload = (req, res) => {
    return res.render("upload-video", { pageTitle: "Upload Video" });
};
export const postVideoUpload = async(req, res) => {
    const { _id } = req.session.user;
    const { video, thumb, captions } = req.files;
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    try{
        const newVideo = await Video.create({
            title,
            description,
            createdAt: new Date(Date.now()).toLocaleDateString(),
            hashtags: Video.formatHashtags(hashtags),
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? Video.changePathFormula(thumb[0].location) : Video.changePathFormula(thumb[0].path),
            captionsUrl: captions ? (isHeroku ? captions[0].location : captions[0].path ) : "",
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        req.flash("info", "Video upload completed");
        return res.redirect("/");
    } catch(error) {
        req.flash("error", "Missing video file");
        return res.status(400).render("upload-video", 
        { pageTitle: "Upload video",  
        errorMessage: error._message});
    }
}

export const getEdit = async(req, res) => {
    const { id } = req.params;
    const { user:{ _id } } = req.session;
    const videos = await Video.findById(id);
    if(!videos) {
        req.flash("error", "Missing video file");
        return res.status(400).render("404", {pageTitle: "Video not found"});
    }
    if(String(videos.owner) !== _id) {
        req.flash("error", "You're not the owner");
        return res.status(403).redirect("/");
    }
    return res.render("edit-video", {pageTitle: `edit: ${videos.title}`, videos})
}
export const postEdit = async(req, res) => {
    const { id } = req.params;
    const {
        session: { user: { _id } },
        body: { title, description, hashtags },
        files: { thumb, captions },
    } = req;
    const videos = await Video.exists({ _id:id }).populate("owner");
    const isHeroku = process.env.NODE_ENV === "production";
    if(!videos) {
        req.flash("error", "Missing video file");
        return res.status(400).render("404", {pageTitle: "Video not found"});
    }
    if(String(videos.owner._id) != _id) {
        req.flash("error", "You're not the owner");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title, 
        description,
        thumbUrl: thumb ? (isHeroku ? Video.changePathFormula(thumb[0].location) : Video.changePathFormula(thumb[0].path)) : videos.thumbUrl,
        captionsUrl: captions ? (isHeroku ? captions[0].location : captions[0].path) : videos.captionsUrl,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("info", "video was edited");
    return res.redirect(`/videos/${id}`);
}
export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    const { user:{ _id } } = req.session;
    const videos = await Video.findById(id);
    if(!videos) {
        req.flash("error", "Missing video file");
        return res.status(400).render("404", {pageTitle: "Video not found"});
    }
    if(String(videos.owner) !== _id) {
        req.flash("error", "You're not the owner");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    req.flash("info", "Deleted the video");
    return res.redirect("/");
}

export const registerFavorites = async(req, res) => {
    const { 
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if(!video) {
        req.flash("error", "Missing video file");
        return res.status(404);
    }
    video.meta.favorites = video.meta.favorites + 1;
    await video.save();
    return res.status(200).json();
}
export const deleteFavorite = async(req, res) => {
    const {
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if(!video) {
        req.flash("error", "Missing video file");
        return res.status(404);
    }
    video.meta.favorites = video.meta.favorites - 1;
    await video.save();
    return res.status(200).json();
}