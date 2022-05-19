import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 80 },
    createdAt: { type: String, required: true },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    captionsUrl: { type: String },
    description: { type: String, required: true },
    hashtags: [{ type: String, trim: true }],
    meta: {
        favorites: { type: Number, default: 0, required: true },
        views: { type: Number, default: 0, required: true },
        subscribe: { type: Number, default: 0, required: true },
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});


videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})
videoSchema.static("changePathFormula", function(urlPath) {
    return urlPath.replace(/\\/g, "/");
});

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;