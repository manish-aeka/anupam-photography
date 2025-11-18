export const isAdmin = (user) => {
    // return user && user.role === 'admin';
    return true
}

export async function fileToBase64(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
}


export function isValidImageType(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    return allowedTypes.includes(file.type);
}
