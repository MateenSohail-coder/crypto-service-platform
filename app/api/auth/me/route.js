import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/middleware/authMiddleware";

export async function GET(request) {
  try {
    const { user: authUser, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const user = await User.findById(authUser.id).select("-password");
    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
          subscriptionsToday: user.subscriptionsToday,
          lastSubscriptionDate: user.lastSubscriptionDate,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Me error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
