

import { connectDB } from "$lib/server/db";
import { Image } from "$lib/server/model/image.model";
import { uploadPhoto } from "$lib/service/image.service";
import { isAdmin } from "$lib/utils/auth.js";
import { isValidImageType } from "$lib/utils/utils.js";
import mongoose from "mongoose";


export async function GET({ url }) {
    try {
        await connectDB();

        // ----- Query Params -----
        const pageParam = url.searchParams.get("page");
        const limitParam = url.searchParams.get("limit");

        const sortField = url.searchParams.get("sort") || "createdAt";
        const sortOrder = url.searchParams.get("order") === "desc" ? -1 : 1;
        const search = url.searchParams.get("search") || "";

        // ----- Filters -----
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { title: new RegExp(search, "i") },
                    { name: new RegExp(search, "i") }
                ]
            };
        }

        // ----- Pagination Logic -----
        let query = Image.find(filter).sort({ [sortField]: sortOrder });

        let page = 1;
        let limit = null;

        if (limitParam) {
            // Apply pagination only if limit is provided
            limit = Number(limitParam);
            page = Number(pageParam) || 1;

            const skip = (page - 1) * limit;

            query = query.skip(skip).limit(limit);
        }

        // Execute Query
        const data = await query.lean();

        // Total count (for pagination UI)
        const total = await Image.countDocuments(filter);

        return new Response(
            JSON.stringify({
                page: limit ? page : null,
                limit: limit,
                total,
                totalPages: limit ? Math.ceil(total / limit) : null,
                data
            }),
            { status: 200 }
        );

    } catch (error) {
        console.log("Error:", error?.message);
        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }
}

export async function DELETE({ request }) {
    try {
        const user = null; // Replace with actual user retrieval logic
        if (!isAdmin(user)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        await connectDB();

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: "body is required." }), {
                status: 400
            });
        }

        const { image_ids } = body;

        if (!Array.isArray(image_ids)) {
            return new Response(
                JSON.stringify({ error: "image_ids must be an array." }),
                { status: 400 }
            );
        }

        if (image_ids.length === 0) {
            return new Response(
                JSON.stringify({ error: "image_ids length can't be 0" }),
                { status: 400 }
            );
        }

        // ✅ Validate all ObjectIds
        for (const id of image_ids) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Response(
                    JSON.stringify({ error: `Invalid MongoDB ObjectId: ${id}` }),
                    { status: 400 }
                );
            }
        }

        // 🔥 Perform bulk delete
        const response = await Image.deleteMany({ _id: { $in: image_ids } });

        return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.log("Error:", error?.message);
        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }
}

export async function POST({ request }) {
    try {
        const user = null; // replace with real user logic

        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401
            });
        }

        await connectDB();

        const form = await request.formData();

        // 📌 All files with key "photos"
        const files = form.getAll("photos");

        if (!files || files.length === 0) {
            return new Response(JSON.stringify({ error: "No files sent" }), {
                status: 400
            });
        }

        for (const file of files) {
            if (!isValidImageType(file)) {
                return new Response(JSON.stringify({ error: "Invalid image type" }), {
                    status: 400
                });
            }
        }

        const image_urls = [];


        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const image_url = await uploadPhoto(file);
            image_urls.push(image_url);
        }

        const insertPayload = image_urls.map((url) => ({ url }));;
        await Image.insertMany(insertPayload);

        return new Response(JSON.stringify({ message: "Images uploaded successfully" }), {
            status: 200
        });

    } catch (err) {
        console.log("Upload Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500
        });
    }
}








