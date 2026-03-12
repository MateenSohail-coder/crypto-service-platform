import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { requireAdmin } from "@/middleware/authMiddleware";

export async function GET(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const subscriptions = await Subscription.find()
      .populate("userId", "name email")
      .populate("serviceId", "name image")
      .sort({ createdAt: -1 });

    const totalCommission = subscriptions.reduce(
      (sum, s) => sum + (s.commissionEarned || 0),
      0,
    );

    const totalVolume = subscriptions.reduce(
      (sum, s) => sum + (s.price || 0),
      0,
    );

    return Response.json(
      {
        success: true,
        subscriptions,
        stats: {
          totalSubscriptions: subscriptions.length,
          totalCommission,
          totalVolume,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin subscriptions fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
