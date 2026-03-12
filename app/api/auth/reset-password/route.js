import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { resetToken, password } = body;

    if (!resetToken || !password) {
      return Response.json(
        {
          success: false,
          message: "Reset token and new password are required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    // Verify reset token
    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json(
        {
          success: false,
          message: "Reset link has expired. Please start over.",
        },
        { status: 401 },
      );
    }

    if (payload.purpose !== "password_reset") {
      return Response.json(
        { success: false, message: "Invalid reset token." },
        { status: 401 },
      );
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    // ✅ Update password — User model pre-save hook hashes it automatically
    user.password = password;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password reset successfully. You can now login.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
