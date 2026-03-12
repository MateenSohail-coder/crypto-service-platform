import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { requireAuth } from "@/middleware/authMiddleware";

// GET — fetch all notifications for current user
export async function GET(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const notifications = await Notification.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: user.id,
      isRead: false,
    });

    return Response.json(
      { success: true, notifications, unreadCount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// PATCH — mark all notifications as read
export async function PATCH(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    await Notification.updateMany(
      { userId: user.id, isRead: false },
      { $set: { isRead: true } },
    );

    return Response.json(
      { success: true, message: "All notifications marked as read." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notifications patch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE — clear all notifications
export async function DELETE(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    await Notification.deleteMany({ userId: user.id });

    return Response.json(
      { success: true, message: "All notifications cleared." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notifications delete error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
