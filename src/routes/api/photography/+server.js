import { connectDB } from "$lib/server/db";
import { Photography } from "$lib/server/model/photogrphy.model";
import { isAdmin } from "$lib/utils/auth";
export async function GET() {
    try {
        await connectDB();

        // const sidebarItems = [
        //     { title: "Carousel", urls: [], max_items: 5 },
        //     { title: "Featured", urls: [], max_items: 5 },
        //     { title: "Settings", urls: [], max_items: 5 },
        // ];
        // const data = await Photography.insertMany(sidebarItems);

        const data = await Photography.find({});
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error?.message }), { status: 500 });
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

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: "body is required." }), {
                status: 400
            });
        }

        await connectDB();

        console.log("body:", body)

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
