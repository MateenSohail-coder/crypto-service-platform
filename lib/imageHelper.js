/**
 * Convert a File/Blob from FormData to base64 string
 * Returns { base64, error }
 */
export async function fileToBase64(file) {
  try {
    // Validate type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        base64: null,
        error: "Only JPG, PNG, and WEBP images are allowed.",
      };
    }

    // Validate size — max 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return {
        base64: null,
        error: "Image must be smaller than 2MB.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    return { base64, error: null };
  } catch (err) {
    console.error("fileToBase64 error:", err);
    return { base64: null, error: "Failed to process image." };
  }
}
