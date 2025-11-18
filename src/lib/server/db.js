import mongoose from "mongoose";
import { MONGODB_URI, MONGO_DB_NAME } from "$env/static/private";

let isConnected = false;

export async function connectDB() {
    if (isConnected) return;

    const uri = MONGODB_URI;

    if (!uri) {
        throw new Error("❌ MONGODB_URI is missing in .env");
    }

    try {
        const conn = await mongoose.connect(uri, {
            dbName: MONGO_DB_NAME || "test",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = conn.connections[0].readyState === 1;
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Error:", err);
        throw err;
    }
}
