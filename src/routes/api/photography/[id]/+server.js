import { connectDB } from '$lib/server/db.js';
import { Photography } from '$lib/server/model/photogrphy.model.js';
import { isAdmin } from '$lib/utils/auth';

export async function PUT({ request, params }) {
    try {
        await connectDB();

        // TODO: Replace this with real authentication logic
        const user = null;
        if (!isAdmin(user)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: "ID is required in params." }),
                { status: 400 }
            );
        }

        const existingPhotography = await Photography.findById(id);

        if (!existingPhotography) {
            return new Response(
                JSON.stringify({ error: `Photography data not found for ID: ${id}` }),
                { status: 404 }
            );
        }

        // Parse request body safely
        let body;
        try {
            body = await request.json();
        } catch {
            return new Response(
                JSON.stringify({ error: "Invalid JSON body." }),
                { status: 400 }
            );
        }

        const updatedFields = {};
        const allowedFields = ['title', 'url', 'description', 'heading'];
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updatedFields[field] = body[field];
            }
        }

        const updatedData = await Photography.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );

        console.log(body)


        return new Response(JSON.stringify(updatedData), { status: 200 });

    } catch (error) {
        console.log("Error:", error?.message);
        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }
}

export async function POST({ request, params }) {
    await connectDB();

    const response = await Photography.insertOne(request.body);

    return new Response(JSON.stringify(response), { status: 200 });
}

