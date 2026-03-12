import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Auto-delete document from MongoDB after expiry
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
export default OTP;
