import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAuth, requireAdmin } from "@/middleware/authMiddleware";

// ── image helper inline (no separate file needed) ─────────────────────────
async function processImage(file) {
  if (!file || file.size === 0) return { base64: null, error: null };

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      base64: null,
      error: "Only JPG, PNG, and WEBP images are allowed.",
    };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { base64: null, error: "Image must be smaller than 2MB." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  return { base64, error: null };
}

// GET — all active services (authenticated users)
export async function GET(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return Response.json({ success: true, services }, { status: 200 });
  } catch (error) {
    console.error("Services fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// POST — create service (admin only)
export async function POST(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const commissionRate = parseFloat(formData.get("commissionRate"));
    const imageFile = formData.get("image");

    if (!name || !description || isNaN(price) || isNaN(commissionRate)) {
      return Response.json(
        {
          success: false,
          message: "Name, description, price and commission rate are required.",
        },
        { status: 400 },
      );
    }

    if (price < 0) {
      return Response.json(
        { success: false, message: "Price cannot be negative." },
        { status: 400 },
      );
    }

    if (commissionRate < 0 || commissionRate > 100) {
      return Response.json(
        {
          success: false,
          message: "Commission rate must be between 0 and 100.",
        },
        { status: 400 },
      );
    }

    // Process image
    const { base64: imageBase64, error: imageError } =
      await processImage(imageFile);
    if (imageError) {
      return Response.json(
        { success: false, message: imageError },
        { status: 400 },
      );
    }

    const service = await Service.create({
      name: name.trim(),
      description: description.trim(),
      price,
      commissionRate,
      image: imageBase64,
      createdBy: user.id,
    });

    return Response.json(
      { success: true, message: "Service created successfully.", service },
      { status: 201 },
    );
  } catch (error) {
    console.error("Service create error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// PATCH — toggle active/inactive (admin only)
export async function PATCH(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { id, isActive } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Service ID is required." },
        { status: 400 },
      );
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true },
    );

    if (!service) {
      return Response.json(
        { success: false, message: "Service not found." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: `Service ${isActive ? "activated" : "deactivated"}.`,
        service,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Service patch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE — delete service (admin only)
export async function DELETE(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Service ID is required." },
        { status: 400 },
      );
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return Response.json(
        { success: false, message: "Service not found." },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Service deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Service delete error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
