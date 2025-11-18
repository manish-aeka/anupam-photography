import mongoose from "mongoose";

const PhotographySchema = new mongoose.Schema({
    title: String,
    urls: [String],
    max_items: Number,
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
);

// Prevent model overwrite on HMR
export const Photography = mongoose.models.PHOTOGRAPHYS || mongoose.model("PHOTOGRAPHYS", PhotographySchema);
