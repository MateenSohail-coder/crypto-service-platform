import Notification from "@/models/Notification";
import User from "@/models/User";

/**
 * Create a notification for a specific user
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  metadata = {},
}) {
  try {
    await Notification.create({ userId, title, message, type, metadata });
  } catch (err) {
    console.error("createNotification error:", err);
  }
}

/**
 * Create a notification for ALL admin users
 */
export async function createAdminNotification({
  title,
  message,
  type,
  metadata = {},
}) {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");
    if (!admins.length) return;

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title,
      message,
      type,
      metadata,
      isRead: false,
    }));

    await Notification.insertMany(notifications);
  } catch (err) {
    console.error("createAdminNotification error:", err);
  }
}
