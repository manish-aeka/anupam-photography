import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent model overwrite on HMR
export const Image = mongoose.models.Upload || mongoose.model("IMAGE", ImageSchema);
