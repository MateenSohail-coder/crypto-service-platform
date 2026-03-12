import connectDB from "@/lib/mongodb";
import OTP from "@/models/OTP";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return Response.json(
        { success: false, message: "Email and OTP are required." },
        { status: 400 },
      );
    }

    const record = await OTP.findOne({ email });

    if (!record) {
      return Response.json(
        {
          success: false,
          message: "OTP expired or not found. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // Check max attempts (prevent brute force)
    if (record.attempts >= 5) {
      await OTP.deleteOne({ email });
      return Response.json(
        {
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        },
        { status: 429 },
      );
    }

    // Check if expired
    if (new Date() > record.expiresAt) {
      await OTP.deleteOne({ email });
      return Response.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // Check OTP match
    if (record.otp !== otp) {
      await OTP.updateOne({ email }, { $inc: { attempts: 1 } });
      const remaining = 5 - (record.attempts + 1);
      return Response.json(
        {
          success: false,
          message: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        },
        { status: 400 },
      );
    }

    // ✅ OTP is correct — generate a short-lived reset token (5 mins)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const resetToken = await new SignJWT({ email, purpose: "password_reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("5m")
      .sign(secret);

    // Delete OTP — it's been used
    await OTP.deleteOne({ email });

    return Response.json(
      {
        success: true,
        message: "OTP verified successfully.",
        resetToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
