import { fileToBase64 } from "$lib/utils/utils";

export async function uploadPhoto(file) {
    try {
        return await fileToBase64(file);
    } catch (error) {
        throw new Error("Failed to convert file to Base64: " + error.message);
    }
}