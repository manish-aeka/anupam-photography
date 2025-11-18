import { connectDB } from "$lib/server/db";
import { Image } from "$lib/server/model/image.model";
import mongoose from "mongoose";
import { isAdmin } from "$lib/utils/utils";

export async function DELETE({ params }) {
    try {
        const user = null; // Replace with actual user retrieval logic
        if (!isAdmin(user)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        await connectDB();

        const image_id = params.id;

        if (!image_id) {
            return new Response(
                JSON.stringify({ error: "Image [id] is required as params." }),
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(image_id)) {
            return new Response(
                JSON.stringify({ error: `Invalid MongoDB ObjectId: ${image_id}` }),
                { status: 400 }
            );
        }

        // 🔥 DELETE FROM DB (Example: Image model)
        const response = await Image.findByIdAndDelete(image_id);
        if (!response) {
            return new Response(
                JSON.stringify({ error: "Image not found." }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Image deleted successfully", id: image_id }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error:", error?.message);

        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }
}

