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
      from: `"Bstock Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset Code — Bstock",
      html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;background:#ffffff;line-height:1.6;font-size:16px;">

  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:500px;margin:0 auto;">
    
    <!-- EXACT Logo Section -->
    <tr>
      <td style="padding:24px;border-bottom:1px solid rgba(255,255,255,0.05);background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);border-radius:12px 12px 0 0;text-align:center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="vertical-align:middle;padding-right:12px;">
              <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:inline-block;text-align:center;line-height:32px;box-shadow:0 4px 12px rgba(124,58,237,0.4);">
                <span style="color:white;font-size:14px;font-weight:bold;vertical-align:middle;">↑</span>
              </div>
            </td>
            <td style="vertical-align:middle;">
              <span style="color:#ffffff;font-weight:700;font-size:20px;letter-spacing:-0.02em;font-family:'Sora',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;vertical-align:middle;">
                Bstock
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Header -->
    <tr>
      <td style="text-align:center;padding-bottom:40px;">
        <h1 style="font-size:28px;font-weight:600;color:#111827;margin:0 0 8px 0;">Password Reset Request</h1>
        <p style="color:#6b7280;font-size:15px;margin:0;">Verification Code</p>
      </td>
    </tr>

    <!-- Greeting & Message -->
    <tr>
      <td style="padding-bottom:32px;">
        <p style="color:#374151;font-size:16px;margin:0;">
          Hello <strong>${user.name}</strong>,<br><br>
          Please use the one-time verification code below to complete your password reset:
        </p>
      </td>
    </tr>

    <!-- OTP Code -->
    <tr>
      <td style="text-align:center;padding-bottom:36px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="font-size:48px;font-weight:400;letter-spacing:8px;color:#1f2937;margin:0;padding:24px 20px;background:#e8e9eb;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);line-height:1.2;text-align:center;vertical-align:middle;">
              ${otp}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Expiration Warning -->
    <tr>
      <td style="background:#fef3c7;border-left:4px solid #f59e0b;padding:18px 20px;border-radius:0 6px 6px 0;">
        <p style="color:#92400e;font-size:14px;margin:0;font-weight:500;line-height:1.5;">
          This code will expire in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="text-align:center;padding-top:28px;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:13px;margin:0 0 4px;">
          If you did not request this reset, please ignore this email.
        </p>
        <p style="color:#9ca3af;font-size:13px;margin:0;">
          Your account remains secure.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>

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
