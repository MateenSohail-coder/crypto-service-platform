import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAuth, requireAdmin } from "@/middleware/authMiddleware";

// GET - all active services (authenticated users)
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

// POST - create service (admin only)
export async function POST(request) {
  try {
    const { user: admin, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { name, description, price, commissionRate } = body;

    // Validate input
    if (!name || price === undefined || commissionRate === undefined) {
      return Response.json(
        {
          success: false,
          message: "Name, price, and commissionRate are required.",
        },
        { status: 400 },
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return Response.json(
        { success: false, message: "Price must be a positive number." },
        { status: 400 },
      );
    }

    if (
      typeof commissionRate !== "number" ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      return Response.json(
        {
          success: false,
          message: "Commission rate must be between 0 and 100.",
        },
        { status: 400 },
      );
    }

    const service = await Service.create({
      name,
      description: description || "",
      price,
      commissionRate,
      createdBy: admin.id,
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
