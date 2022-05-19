import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ownerAvatarUrl: { type: String },
    username: String,
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    createdAt: { type: String, required: true },
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
