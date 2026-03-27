import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import os from "os";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveImage(file) {
  if (!file || file.size === 0)
    return { url: null, publicId: null, error: null };

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, publicId: null, error: "Only JPG, PNG, WEBP allowed." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { url: null, publicId: null, error: "Image must be under 2MB." };
  }

  try {
    // Save to temp file first
    const tempPath = path.join(
      os.tmpdir(),
      `upload-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.type.split("/")[1]}`,
    );
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "crypto-service-platform",
      resource_type: "image",
      quality: "auto",
      format: "webp",
    });

    // Cleanup temp file
    fs.unlinkSync(tempPath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      error: null,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      url: null,
      publicId: null,
      error: "Upload failed. Please try again.",
    };
  }
}

export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
}
