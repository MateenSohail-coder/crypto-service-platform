import fs from "fs";
import path from "path";

export async function saveImage(file) {
  if (!file || file.size === 0) return { url: null, error: null };

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: "Only JPG, PNG, WEBP allowed." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { url: null, error: "Image must be under 2MB." };
  }

  // Create uploads folder if not exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Unique filename
  const ext = file.type.split("/")[1];
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  // Return public URL
  return { url: `/uploads/${filename}`, error: null };
}

export function deleteImage(url) {
  if (!url || url.startsWith("data:")) return; // skip base64
  try {
    const filepath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch (err) {
    console.error("Delete image error:", err);
  }
}
