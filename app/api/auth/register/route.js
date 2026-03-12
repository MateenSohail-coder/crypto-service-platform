import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { createAdminNotification } from "@/lib/createNotification";
import { notifyAdmins } from "@/lib/eventEmitter";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email is already registered." },
        { status: 409 },
      );
    }

    const user = await User.create({ name, email, password });

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // ✅ Notify all admins about new user registration
    await createAdminNotification({
      title: "New User Registered",
      message: `${name} (${email}) just created an account.`,
      type: "new_user",
      metadata: { userId: user._id, name, email },
    });

    // Real-time push to online admins
    notifyAdmins("new_user", {
      userId: user._id,
      name,
      email,
    });

    return Response.json(
      {
        success: true,
        message: "Registration successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
          subscriptionsToday: user.subscriptionsToday,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
