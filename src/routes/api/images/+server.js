

import { connectDB } from "$lib/server/db";
import { Image } from "$lib/server/model/image.model";
import { isAdmin } from "$lib/utils/utils";
import mongoose from "mongoose";


// export async function GET() {
//     try {
//         await connectDB();
//         const uploadedImages = await Image.find({});

//         return new Response(JSON.stringify(uploadedImages), {
//             status: 200
//         });
//     } catch (error) {
//         console.log("Error: ", error?.message)
//         return new Response(JSON.stringify({ error: error?.message }), {
//             status: 500
//         });
//     }
// }

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

export async function POST({ request }) {
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

        const { image_url, image_urls } = body;

        if (!image_url && (!image_urls || image_urls.length === 0)) {
            return new Response(JSON.stringify({ error: "either image_url or image_urls is required." }), {
                status: 400
            });
        }

        if (image_url && Array.isArray(image_url)) {
            return new Response(JSON.stringify({ error: "image_url cannot be an array." }), {
                status: 400
            });
        }

        if (image_urls && !Array.isArray(image_urls)) {
            return new Response(JSON.stringify({ error: "image_urls must be an array." }), {
                status: 400
            });
        }

        let response;

        if (Array.isArray(image_urls)) {
            const imagesPayload = image_urls.map((url) => ({ url: url }));
            response = await Image.insertMany(imagesPayload);
        } else {
            const payload = {
                url: image_url,
            }

            response = await Image.create(payload);

        }

        return new Response(JSON.stringify(response), {
            status: 201
        });

    } catch (error) {
        console.log("Error: ", error?.message)
        return new Response(JSON.stringify({ error: error?.message }), {
            status: 500
        });
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





