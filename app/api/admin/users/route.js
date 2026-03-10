import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/authMiddleware";

export async function GET(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
