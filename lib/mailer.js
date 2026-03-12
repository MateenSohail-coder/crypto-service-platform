import nodemailer from "nodemailer";

// ── Gmail transporter ─────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send OTP email to user
 */
export async function sendOTPEmail({ to, otp, name }) {
  const mailOptions = {
    from: `"NexVault Security" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Password Reset Code — NexVault",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#07070f;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:480px;margin:40px auto;padding:0 16px;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
            <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:24px;">🔐</span>
            </div>
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
              Password Reset
            </h1>
            <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">
              NexVault Security
            </p>
          </div>

          <!-- Body -->
          <div style="background:#0f0f1a;border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 16px 16px;padding:32px;">
            
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 24px;">
              Hi <strong style="color:#fff;">${name}</strong>, we received a request to reset your NexVault password.
            </p>

            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">
              Your verification code
            </p>

            <!-- OTP Box -->
            <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1));border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
              <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#a78bfa;font-family:'Courier New',monospace;">
                ${otp}
              </span>
            </div>

            <!-- Expiry warning -->
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:12px 16px;margin:0 0 24px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:16px;">⏰</span>
              <p style="color:#fbbf24;font-size:13px;margin:0;">
                This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
              </p>
            </div>

            <p style="color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;margin:0 0 8px;">
              If you did not request a password reset, you can safely ignore this email. Your account remains secure.
            </p>

            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;">

            <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin:0;">
              © ${new Date().getFullYear()} NexVault. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
