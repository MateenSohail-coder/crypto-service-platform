import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAuth, requireAdmin } from "@/middleware/authMiddleware";
import { saveImage, deleteImage } from "@/lib/uploadImage";

function validateServiceData(serviceData) {
  const errors = [];

  if (
    !serviceData.name ||
    serviceData.name.trim().length < 1 ||
    serviceData.name.trim().length > 100
  ) {
    errors.push("Service name required (1-100 chars)");
  }

  if (
    !serviceData.description ||
    serviceData.description.trim().length < 10 ||
    serviceData.description.trim().length > 1000
  ) {
    errors.push("Description required (10-1000 chars)");
  }

  const price = parseFloat(serviceData.price);
  if (isNaN(price) || price < 0) {
    errors.push("Valid price required (>= 0)");
  }

  const commissionRate = parseFloat(serviceData.commissionRate);
  if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
    errors.push("Commission rate required (0-100%)");
  }

  if (errors.length > 0) throw new Error(errors.join("; "));

  return {
    name: serviceData.name.trim(),
    description: serviceData.description.trim(),
    price,
    commissionRate,
  };
}

// GET — active services (authenticated users)
export async function GET(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const services = await Service.find({ isActive: true })
      .select(
        "name description imageUrl price commissionRate isActive createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return Response.json({ success: true, services }, { status: 200 });
  } catch (error) {
    console.error("Services fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// POST — create service (admin)
export async function POST(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const formData = await request.formData();

    const validated = validateServiceData({
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      price: formData.get("price")?.toString() || "0",
      commissionRate: formData.get("commissionRate")?.toString() || "0",
    });

    const imageFile = formData.get("image");
    const {
      url: imageUrl,
      publicId: imagePublicId,
      error: imageError,
    } = await saveImage(imageFile);
    if (imageError) {
      return Response.json(
        { success: false, message: imageError },
        { status: 400 },
      );
    }

    const newService = await Service.create({
      ...validated,
      imageUrl,
      imagePublicId,
      createdBy: user.id,
    });

    return Response.json(
      {
        success: true,
        message: "Service created successfully.",
        service: newService,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Service create error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 400 },
    );
  }
}

// PATCH — toggle active/inactive (admin)
export async function PATCH(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const { id, isActive } = await request.json();

    if (!id) {
      return Response.json(
        { success: false, message: "Service ID is required." },
        { status: 400 },
      );
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true },
    );

    if (!updatedService) {
      return Response.json(
        { success: false, message: "Service not found." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: `Service ${isActive ? "activated" : "deactivated"}.`,
        service: updatedService,
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

// DELETE — delete service (admin)
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

    const service = await Service.findById(id);
    if (!service) {
      return Response.json(
        { success: false, message: "Service not found." },
        { status: 404 },
      );
    }

    // Delete image file from VPS disk
    deleteImage(service.imagePublicId);

    await Service.findByIdAndDelete(id);

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
