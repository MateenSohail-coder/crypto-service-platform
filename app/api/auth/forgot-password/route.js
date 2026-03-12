import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/OTP";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body || !body.email) {
      return Response.json(
        { success: false, message: "Email is required." },
        { status: 400 },
      );
    }

    const email = body.email.toLowerCase().trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Find user — always return success to prevent email enumeration
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        {
          success: true,
          message:
            "If this email is registered, you will receive an OTP shortly.",
        },
        { status: 200 },
      );
    }

    // Delete any old OTPs for this email
    await OTP.deleteMany({ email });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB — expires in 10 minutes
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
    });

    // Send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"NexVault Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset Code — NexVault",
      html: `
        <div style="max-width:480px;margin:40px auto;font-family:Arial,sans-serif;background:#07070f;padding:32px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);width:56px;height:56px;border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;">
              🔐
            </div>
            <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">Password Reset</h1>
            <p style="color:rgba(255,255,255,0.4);font-size:14px;margin:8px 0 0;">NexVault Security</p>
          </div>

          <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi <strong style="color:#fff;">${user.name}</strong>, here is your one-time verification code:
          </p>

          <div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 12px;letter-spacing:2px;text-transform:uppercase;">Your OTP Code</p>
            <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#a78bfa;font-family:'Courier New',monospace;">
              ${otp}
            </span>
          </div>

          <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:14px 16px;margin:0 0 24px;">
            <p style="color:#fbbf24;font-size:13px;margin:0;">
              ⏰ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
            </p>
          </div>

          <p style="color:rgba(255,255,255,0.25);font-size:12px;text-align:center;margin:0;">
            If you did not request this, ignore this email. Your account is safe.
          </p>
        </div>
      `,
    });

    return Response.json(
      {
        success: true,
        message: "OTP sent to your email. Check your inbox.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    // Check specifically for email sending failure
    if (error.code === "EAUTH" || error.responseCode === 535) {
      return Response.json(
        {
          success: false,
          message: "Email service not configured. Please contact support.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }
}
