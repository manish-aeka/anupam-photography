import { connectDB } from "$lib/server/db";
import { Image } from "$lib/server/model/image.model.js";
import { Photography } from "$lib/server/model/photogrphy.model";
import { isAdmin } from "$lib/utils/auth";
export async function GET() {
    try {
        await connectDB();

        // const x = await Image.find({});
        // const temp = x.map((t) => t.url)

        // const sidebarItems = [
        //     { title: "Carousel", urls: temp, max_items: 5 },
        //     { title: "Featured", urls: temp, max_items: 5 },
        //     { title: "Settings", urls: temp, max_items: 5 },
        // ];
        // const data = await Photography.insertMany(sidebarItems);

        const data = await Photography.find({});
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error?.message }), { status: 500 });
    }
}

export async function PUT({ request }) {
    try {
        const user = null; // Replace with actual user retrieval logic
        if (!isAdmin(user)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: "body is required." }), {
                status: 400
            });
        }

        await connectDB();

        const { title, urls } = body;

        if (!title || !urls) {
            return new Response(JSON.stringify({ error: "title and urls are required." }), {
                status: 400
            });
        }

        if (!Array.isArray(urls)) {
            return new Response(JSON.stringify({ error: "urls must be an array." }), {
                status: 400
            });
        }


        const photographyData = await Photography.find({});
        //add checks for the title,url,max_items


        //update
        const respone = await Photography.updateOne({ title }, { $set: { urls } });

        return new Response(JSON.stringify(respone), { status: 200 });
    } catch (error) {
        console.log("Error:", error?.message);
        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }

}

export async function DELETE({ params, request }) {
    try {
        const user = null; // Replace with actual user retrieval logic
        if (!isAdmin(user)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: "body is required." }), {
                status: 400
            });
        }

        await connectDB();

        const { id } = body;
        if (!id) {
            return new Response(JSON.stringify({ error: "ID is required." }), {
                status: 400
            });
        }

        const photographyData = await Photography.findByIdAndDelete(id);

        return new Response(JSON.stringify(photographyData), { status: 200 });
    } catch (error) {
        console.log("Error:", error?.message);
        return new Response(
            JSON.stringify({ error: error?.message }),
            { status: 500 }
        );
    }
}


