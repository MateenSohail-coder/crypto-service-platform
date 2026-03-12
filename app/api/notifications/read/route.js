import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { requireAuth } from "@/middleware/authMiddleware";

export async function PATCH(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return Response.json(
        { success: false, message: "notificationId is required." },
        { status: 400 },
      );
    }

    await Notification.findOneAndUpdate(
      { _id: notificationId, userId: user.id },
      { $set: { isRead: true } },
    );

    return Response.json(
      { success: true, message: "Notification marked as read." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notification read error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
